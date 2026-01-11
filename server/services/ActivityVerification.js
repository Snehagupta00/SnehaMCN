const axios = require('axios');
const MissionAttempt = require('../models/MissionAttempt');

class ActivityVerification {
  async verifyProof(attemptId, proof, requirementType, requirementValue) {
    try {
      const attempt = await MissionAttempt.findOne({ attempt_id: attemptId });
      if (!attempt) {
        throw new Error('Attempt not found');
      }

      let verificationResult = {
        is_valid: false,
        fraud_score: 0,
        api_response: null,
        notes: null,
      };

      switch (requirementType) {
        case 'STEPS':
          verificationResult = await this.verifySteps(proof, requirementValue);
          break;
        case 'PHONE_FREE':
          verificationResult = await this.verifyPhoneFree(proof, requirementValue);
          break;
        case 'QUIZ':
          verificationResult = await this.verifyQuiz(proof, requirementValue);
          break;
        case 'EXPENSE_TRACK':
          verificationResult = await this.verifyExpenseTracking(proof, requirementValue);
          break;
        case 'PRODUCTIVITY':
          verificationResult = await this.verifyProductivity(proof, requirementValue);
          break;
        default:
          verificationResult.notes = 'Unknown requirement type';
      }

      attempt.verification_status = verificationResult.is_valid ? 'APPROVED' : 'REJECTED';
      attempt.fraud_score = verificationResult.fraud_score;
      attempt.api_response = verificationResult.api_response;
      attempt.notes = verificationResult.notes;
      await attempt.save();

      return verificationResult;
    } catch (error) {
      console.error('Error verifying proof:', error);
      throw error;
    }
  }

  async verifySteps(proof, requiredSteps) {
    try {
      if (proof.platform === 'android' && proof.access_token) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startTime = today.getTime() * 1000000;
        const endTime = tomorrow.getTime() * 1000000;

        const response = await axios.get(
          `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
          {
            headers: {
              Authorization: `Bearer ${proof.access_token}`,
            },
            params: {
              aggregateBy: [
                {
                  dataTypeName: 'com.google.step_count.delta',
                  dataSourceId: 'derived:com.google.step_count.delta:platform_type:estimated_steps',
                },
              ],
              bucketByTime: { durationMillis: 86400000 },
              startTimeMillis: startTime / 1000000,
              endTimeMillis: endTime / 1000000,
            },
          }
        );

        const stepCount = response.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;

        return {
          is_valid: stepCount >= requiredSteps,
          fraud_score: this.calculateFraudScore(stepCount, requiredSteps),
          api_response: { step_count: stepCount, required: requiredSteps },
          notes: stepCount >= requiredSteps ? 'Steps verified via Google Fit' : 'Insufficient steps',
        };
      }

      if (proof.platform === 'ios' && proof.healthkit_data) {
        const stepCount = proof.healthkit_data.step_count || 0;
        return {
          is_valid: stepCount >= requiredSteps,
          fraud_score: this.calculateFraudScore(stepCount, requiredSteps),
          api_response: { step_count: stepCount, required: requiredSteps },
          notes: stepCount >= requiredSteps ? 'Steps verified via HealthKit' : 'Insufficient steps',
        };
      }

      if (proof.type === 'MANUAL_CONFIRMATION') {
        return {
          is_valid: true,
          fraud_score: 20,
          api_response: null,
          notes: 'Manual confirmation (requires review)',
        };
      }

      return {
        is_valid: false,
        fraud_score: 100,
        api_response: null,
        notes: 'Invalid proof format',
      };
    } catch (error) {
      console.error('Error verifying steps:', error);
      return {
        is_valid: false,
        fraud_score: 50,
        api_response: { error: error.message },
        notes: 'API verification failed',
      };
    }
  }

  async verifyPhoneFree(proof, requiredMinutes) {
    try {
      if (proof.type === 'SCREENSHOT' || proof.type === 'MANUAL_CONFIRMATION') {
        const minutes = proof.duration_minutes || 0;
        return {
          is_valid: minutes >= requiredMinutes,
          fraud_score: 30,
          api_response: { duration_minutes: minutes, required: requiredMinutes },
          notes: minutes >= requiredMinutes ? 'Phone-free time confirmed' : 'Insufficient duration',
        };
      }

      return {
        is_valid: false,
        fraud_score: 100,
        api_response: null,
        notes: 'Invalid proof format',
      };
    } catch (error) {
      console.error('Error verifying phone-free:', error);
      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Verification failed',
      };
    }
  }

  async verifyQuiz(proof, requiredQuestions) {
    try {
      if (proof.quiz_results && proof.quiz_results.questions_answered >= requiredQuestions) {
        return {
          is_valid: true,
          fraud_score: 10,
          api_response: { questions_answered: proof.quiz_results.questions_answered },
          notes: 'Quiz completed successfully',
        };
      }

      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Quiz not completed',
      };
    } catch (error) {
      console.error('Error verifying quiz:', error);
      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Verification failed',
      };
    }
  }

  async verifyExpenseTracking(proof, requiredExpenses) {
    try {
      if (proof.expenses && proof.expenses.length >= requiredExpenses) {
        return {
          is_valid: true,
          fraud_score: 15,
          api_response: { expenses_count: proof.expenses.length },
          notes: 'Expenses tracked successfully',
        };
      }

      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Insufficient expenses tracked',
      };
    } catch (error) {
      console.error('Error verifying expense tracking:', error);
      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Verification failed',
      };
    }
  }

  async verifyProductivity(proof, requiredValue) {
    try {
      if (proof.task_completed && proof.task_completed === true) {
        return {
          is_valid: true,
          fraud_score: 20,
          api_response: { task_completed: true },
          notes: 'Productivity task completed',
        };
      }

      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Task not completed',
      };
    } catch (error) {
      console.error('Error verifying productivity:', error);
      return {
        is_valid: false,
        fraud_score: 50,
        api_response: null,
        notes: 'Verification failed',
      };
    }
  }

  calculateFraudScore(actualValue, requiredValue) {
    if (actualValue < requiredValue) {
      return 100;
    }

    if (actualValue > requiredValue * 10) {
      return 40;
    }

    return 0;
  }

  async checkFraudPatterns(userId, ipAddress, deviceFingerprint) {
    try {
      return 0;
    } catch (error) {
      console.error('Error checking fraud patterns:', error);
      return 0;
    }
  }
}

module.exports = new ActivityVerification();

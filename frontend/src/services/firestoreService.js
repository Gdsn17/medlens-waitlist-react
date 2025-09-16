// Simple API-based approach to avoid CORS issues
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://medlensai-waitlist.web.app' 
  : 'http://localhost:8080';

/**
 * Saves a signup to the backend API (which then saves to Firestore)
 * @param {string} name - Full name of the user
 * @param {string} email - Email address of the user
 * @param {Object} additionalData - Additional form data (optional)
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export const saveSignup = async (name, email, additionalData = {}) => {
  try {
    console.log('🔥 Saving signup via API...');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Additional Data:', additionalData);

    const response = await fetch(`${API_BASE_URL}/api/waitlist/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: name,
        email: email,
        ...additionalData
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Signup saved successfully:', result.data);
      return {
        success: true,
        message: 'Successfully joined the waitlist!',
        data: result.data
      };
    } else {
      throw new Error(result.message || 'Failed to save signup');
    }

  } catch (error) {
    console.error('❌ Error saving signup:', error);
    
    return {
      success: false,
      message: `Failed to save signup: ${error.message}. Please check your internet connection and try again.`,
      error: error
    };
  }
};

/**
 * Saves a complete waitlist form submission via API (which then saves to Firestore)
 * @param {Object} formData - Complete form data object
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export const saveWaitlistForm = async (formData) => {
  try {
    console.log('🔥 Saving waitlist form via API...');
    console.log('Form Data:', formData);

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.yearOfStudy) {
      throw new Error('Missing required fields: fullName, email, or yearOfStudy');
    }

    const response = await fetch(`${API_BASE_URL}/api/waitlist/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Waitlist form saved successfully:', result.data);
      return {
        success: true,
        message: 'Successfully joined the waitlist!',
        data: result.data
      };
    } else {
      throw new Error(result.message || 'Failed to save waitlist form');
    }

  } catch (error) {
    console.error('❌ Error saving waitlist form:', error);
    
    return {
      success: false,
      message: `Failed to save waitlist form: ${error.message}. Please check your internet connection and try again.`,
      error: error
    };
  }
};

const firestoreService = {
  saveSignup,
  saveWaitlistForm
};

export default firestoreService;
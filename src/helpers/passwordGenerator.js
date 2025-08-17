const crypto = require('crypto');

class PasswordGenerator {
  /**
   * Generate a secure random password
   * @param {number} length - Password length (default: 12)
   * @returns {string} - Generated password
   */
  generateSecurePassword(length = 12) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += this.getRandomChar(lowercase);
    password += this.getRandomChar(uppercase);
    password += this.getRandomChar(numbers);
    password += this.getRandomChar(symbols);
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(allChars);
    }
    
    // Shuffle the password to avoid predictable patterns
    return this.shuffleString(password);
  }

  /**
   * Get a random character from a string
   * @param {string} chars - Characters to choose from
   * @returns {string} - Random character
   */
  getRandomChar(chars) {
    const randomIndex = crypto.randomInt(0, chars.length);
    return chars[randomIndex];
  }

  /**
   * Shuffle string characters randomly
   * @param {string} str - String to shuffle
   * @returns {string} - Shuffled string
   */
  shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  /**
   * Generate a temporary password with expiry
   * @returns {Object} - Password and expiry info
   */
  generateTemporaryPassword() {
    const password = this.generateSecurePassword(10);
    const expiresIn = 24 * 60 * 60 * 1000; // 24 hours
    const expiresAt = new Date(Date.now() + expiresIn);
    
    return {
      password,
      expiresAt,
      isTemporary: true
    };
  }
}

module.exports = new PasswordGenerator();
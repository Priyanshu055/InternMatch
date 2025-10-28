const OpenAI = require('openai');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

/**
 * Analyzes a cover letter using sentiment analysis and AI-generated feedback.
 * @param {string} coverLetter - The cover letter text to analyze.
 * @param {string} companyName - The name of the company for personalized feedback.
 * @param {string} jobTitle - The job title for context.
 * @returns {object} - An object containing sentiment score, enthusiasm level, and AI feedback.
 */
async function analyzeApplication(coverLetter, companyName, jobTitle) {
  try {
    // Perform sentiment analysis
    const sentimentResult = sentiment.analyze(coverLetter);
    const enthusiasmLevel = getEnthusiasmLevel(sentimentResult.score);

    // Detect potential red flags
    const redFlags = detectRedFlags(coverLetter);

    // Generate AI feedback using OpenAI
    const aiFeedback = await generateAIFeedback(coverLetter, companyName, jobTitle, sentimentResult, redFlags);

    return {
      sentimentScore: sentimentResult.score,
      enthusiasmLevel,
      redFlags,
      aiFeedback,
    };
  } catch (error) {
    console.error('Error analyzing application:', error);
    throw new Error('Failed to analyze application');
  }
}

/**
 * Determines enthusiasm level based on sentiment score.
 * @param {number} score - Sentiment score from analysis.
 * @returns {string} - Enthusiasm level description.
 */
function getEnthusiasmLevel(score) {
  if (score > 5) return 'Very Enthusiastic';
  if (score > 2) return 'Enthusiastic';
  if (score > -2) return 'Neutral';
  if (score > -5) return 'Low Enthusiasm';
  return 'Very Low Enthusiasm';
}

/**
 * Detects potential red flags in the cover letter.
 * @param {string} text - The cover letter text.
 * @returns {array} - Array of detected red flags.
 */
function detectRedFlags(text) {
  const flags = [];
  const lowerText = text.toLowerCase();

  // Check for generic phrases
  if (lowerText.includes('to whom it may concern')) {
    flags.push('Using generic salutation instead of personalized greeting');
  }

  // Check for lack of company-specific content
  if (!lowerText.includes('company') && !lowerText.includes('organization')) {
    flags.push('Cover letter lacks company-specific references');
  }

  // Check for typos or poor grammar (basic check)
  const words = text.split(' ');
  if (words.length < 50) {
    flags.push('Cover letter is too short (less than 50 words)');
  }

  // Check for overused buzzwords
  const buzzwords = ['passionate', 'hardworking', 'team player', 'detail-oriented'];
  const buzzwordCount = buzzwords.reduce((count, word) => count + (lowerText.split(word).length - 1), 0);
  if (buzzwordCount > 3) {
    flags.push('Overuse of generic buzzwords');
  }

  return flags;
}

/**
 * Generates AI-powered feedback using OpenAI.
 * @param {string} coverLetter - The cover letter text.
 * @param {string} companyName - Company name.
 * @param {string} jobTitle - Job title.
 * @param {object} sentimentResult - Sentiment analysis result.
 * @param {array} redFlags - Detected red flags.
 * @returns {string} - AI-generated feedback.
 */
async function generateAIFeedback(coverLetter, companyName, jobTitle, sentimentResult, redFlags) {
  const prompt = `
Analyze this internship application cover letter and provide constructive feedback. Focus on:
1. Specificity to the company and role
2. Highlighting relevant experience and skills
3. Enthusiasm and passion
4. Structure and clarity
5. Any red flags or areas for improvement

Cover Letter:
"${coverLetter}"

Company: ${companyName}
Job Title: ${jobTitle}
Sentiment Score: ${sentimentResult.score}
Detected Red Flags: ${redFlags.join(', ') || 'None'}

Provide 3-5 specific, actionable suggestions for improvement. Keep the feedback encouraging and professional.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Unable to generate AI feedback at this time. Please review your cover letter for clarity and specificity.';
  }
}

module.exports = { analyzeApplication };

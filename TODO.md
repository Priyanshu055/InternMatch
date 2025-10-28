# TODO: Implement AI-Powered Application Review Feature

## Overview

Integrate AI-driven review of internship applications using sentiment analysis and generative feedback to provide instant suggestions before submission.

## Steps

- [x] Install required dependencies (OpenAI API, sentiment analysis library)
- [x] Create review utility function for analyzing cover letters
- [x] Add /review endpoint in backend/routes/applications.js
- [x] Update frontend ApplyModal.js to include review step before submission
- [x] Test the review functionality end-to-end
- [x] Set up OpenAI API key in environment variables

## Dependencies

- openai: For generating personalized feedback
- sentiment: For analyzing enthusiasm in cover letters

## Files to Modify

- backend/package.json: Add dependencies
- backend/routes/applications.js: Add review endpoint
- backend/utils/review.js: New file for review logic
- frontend/src/components/ApplyModal.js: Add review UI and logic

## Next Steps

- Ensure OPENAI_API_KEY is set in the backend .env file
- Test the feature with sample cover letters
- Consider adding rate limiting to the review endpoint
- Add error handling for API failures

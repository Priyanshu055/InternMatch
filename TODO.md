# TODO List for Fixing Internship Application and Messaging Issues

## 1. Add Profile Images to User Model

- [x] Update backend/models/User.js to include profileImage field

## 2. Implement Image Upload in Backend

- [x] Modify backend/routes/profiles.js to handle profile image upload for both candidates and employers
- [x] Ensure multer is configured for image uploads (jpg, png, etc.)

## 3. Fix Apply Button Functionality

- [x] Debug frontend/src/components/ApplyModal.js for authentication issues
- [x] Ensure token is properly sent in axios requests
- [x] Check backend/routes/applications.js for any server-side errors

## 4. Restrict Messaging to Messages Section Only

- [x] Remove send message functionality from applications tab in frontend/src/pages/Dashboard.js
- [x] Ensure messaging is only available in the Messages tab
- [x] Update sendMessage function to handle errors properly

## 5. Update Frontend to Display Profile Images

- [x] Modify backend/routes/internships.js to populate profileImage in internship listings
- [x] Update frontend/src/pages/Dashboard.js to display employer's profile image in internship listings
- [x] Update frontend/src/pages/CandidateProfile.js to allow image upload and display
- [x] Ensure images are fetched and displayed correctly

## 6. Enable Bidirectional Messaging

- [x] Update backend/routes/messages.js to allow employers to send messages to candidates
- [x] Update message retrieval for both candidates and employers to show sent and received messages

## 7. Auto-Save Internships on Apply

- [x] Modify frontend/src/components/ApplyModal.js to auto-save internship when applying
- [x] Update frontend/src/pages/Dashboard.js to refresh saved internships after applying

## 8. Testing

- [x] Start backend server (port 5000)
- [x] Start frontend React app
- [ ] Test apply functionality after fixes
- [ ] Test messaging from Messages section
- [ ] Verify image uploads and displays for both candidates and employers

## 9. Optimize Dashboard.js for Performance

- [x] Add useMemo to imports alongside useCallback
- [x] Wrap fetch functions (fetchRecommendedInternships, fetchAllInternships, etc.) with useCallback([], []) to prevent recreation on every render
- [x] Wrap filteredInternships with useMemo([allInternships, searchTerm, filterLocation]) to compute only when dependencies change

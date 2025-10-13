# TODO: Fix Edit and Delete Buttons in Employer Dashboard

## Tasks to Complete

- [ ] Create frontend/src/pages/EditInternship.js: Build a new component similar to PostInternship.js that fetches internship data by ID, pre-fills the form, and handles updates via PUT request.
- [ ] Update frontend/src/pages/Dashboard.js: Add onClick handler to the Edit button to navigate to '/edit-internship/:id', and ensure the Delete button calls the existing deleteInternship function.
- [ ] Update frontend/src/App.js: Add a new route for '/edit-internship/:id' that renders the EditInternship component.
- [ ] Test functionality: Verify navigation to edit page, form pre-filling, successful updates, and delete operation with list refresh.

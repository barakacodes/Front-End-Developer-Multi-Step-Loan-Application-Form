describe('Personal Loan - Happy Path', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('completes the full 8-step loan application successfully', () => {
    // --- STEP 1 ---
    cy.contains('Step 1 of').should('be.visible');
    cy.get('input[value="Personal"]').click();
    cy.get('input[name="loanAmount"]').type('300000');
    cy.contains('Next Step').click();

    // --- STEP 2 ---
    cy.contains('Personal Information').should('be.visible');
    cy.get('input[name="fullName"]').type('Baraka Test User');
    cy.get('input[name="dateOfBirth"]').type('1995-01-01');
    cy.get('input[value="Male"]').click();
    cy.get('select[name="maritalStatus"]').select('Single');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="mobileNumber"]').type('9876543210');
    cy.contains('Next Step (KYC)').click();

    // --- STEP 3 (KYC) ---
    cy.contains('KYC Verification').should('be.visible');
    cy.get('input[name="panNumber"]').type('AAAPP1234F').blur();
    cy.contains('✅ Verified', { timeout: 2000 }).should('be.visible'); // Wait for 1.5s simulation
    cy.get('input[name="aadhaarNumber"]').type('987654321012').blur();
    cy.contains('✅ Verified', { timeout: 2000 }).should('be.visible');
    cy.get('input[name="kycConsent"]').check();
    cy.contains('Next Step (Address)').click();

    // --- STEP 4 (Address) ---
    cy.contains('Address Details').should('be.visible');
    cy.get('input[name="currentAddress1"]').type('123 Test Street');
    cy.get('input[name="pinCode"]').type('110001').blur();
    // Wait for PIN lookup to auto-fill
    cy.get('input[name="city"]').should('have.value', 'New Delhi');
    cy.get('input[name="state"]').should('have.value', 'Delhi');
    cy.get('input[value="Owned"]').click();
    cy.get('input[name="yearsAtAddress"]').type('5');
    cy.get('input[name="sameAsPermanent"]').check();
    cy.contains('Next Step (Employment)').click();

    // --- STEP 5 (Employment - Salaried) ---
    cy.contains('Employment & Income Details').should('be.visible');
    cy.get('input[value="Salaried"]').click();
    cy.get('input[name="companyName"]').type('Tech Corp');
    cy.get('input[name="designation"]').type('Developer');
    cy.get('input[name="monthlyNetSalary"]').type('50000');
    cy.get('input[name="yearsOfExperience"]').type('5');
    cy.contains('Next Step (Co-Applicant)').click();

    // --- STEP 6 (Should be skipped because amount is 300k) ---
    // We verify we land directly on STEP 7
    cy.contains('Document Upload & E-Signature').should('be.visible');
    cy.url().should('not.include', 'step=6');

    // --- STEP 7 (Documents & Signature) ---
    // Upload mock image (Cypress fixtures)
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/test-image.jpg', { force: true });
    cy.contains('Compressing image...').should('be.visible');
    cy.contains('SignatureCanvas', { timeout: 5000 }).parent().find('canvas').click();
    // Draw a simple signature (trigger mouse events)
    cy.get('canvas').trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 100 })
      .trigger('mouseup');
    cy.contains('Next Step (Review)').click();

    // --- STEP 8 (Review & Submit) ---
    cy.contains('Review & Pre-Approval Summary').should('be.visible');
    // Check all 4 consents
    cy.get('input[type="checkbox"]').each(($el) => {
      cy.wrap($el).check();
    });
    // Submit
    cy.contains('Submit Application').click();

    // --- FINAL VERIFICATION ---
    cy.contains('Application Submitted!').should('be.visible');
    cy.contains('Reference Number').should('be.visible');
  });
});
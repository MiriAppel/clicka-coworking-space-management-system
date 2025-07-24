describe('Document Upload Integration', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/customers', { fixture: 'customers.json' }).as('getCustomers');
    cy.intercept('POST', '/api/document/save', { fixture: 'document-success.json' }).as('uploadDocument');
    cy.visit('/documentUpload');
  });

  it('should complete document upload flow', () => {
    cy.wait('@getCustomers');
    
    // Select customer
    cy.get('[data-testid="customer-select"]').click();
    cy.contains('לקוח ראשון').click();
    
    // Select file type
    cy.get('[data-testid="file-type-select"]').click();
    cy.contains('חוזה').click();
    
    // Upload file
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('test content'),
      fileName: 'test.pdf',
      mimeType: 'application/pdf'
    });
    
    cy.get('[data-testid="upload-button"]').click();
    cy.wait('@uploadDocument');
    
    // Verify success
    cy.contains('הקובץ נשמר בהצלחה').should('be.visible');
  });
});
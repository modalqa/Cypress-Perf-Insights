describe('API Response Time Test', () => {
  it('measures API response time', () => {
    const testStartTime = Date.now();
    const url = 'https://reqres.in/api/users';

    cy.intercept('GET', url).as('apiRequest');
    cy.visit('https://reqres.in');

    cy.wait('@apiRequest').then((interception) => {
      const apiResponseTime = interception.response.duration;
      cy.log(`API response time: ${apiResponseTime} ms`);

      const testEndTime = Date.now();
      const testDuration = testEndTime - testStartTime;

      cy.task('logPerformanceTiming', {
        url,
        performanceTiming: {}, // No performance timing in this test
        apiResponseTime,
        testDuration
      });
    });
  });

  after(() => {
    cy.task('generatePerformanceReport');
  });
});

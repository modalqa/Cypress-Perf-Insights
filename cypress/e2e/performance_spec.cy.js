describe('Performance Test', () => {
  it('measures page load performance', () => {
    const testStartTime = Date.now();
    const url = 'https://example.cypress.io';

    cy.visit(url);

    cy.window().then((win) => {
      const performanceTiming = win.performance.timing;

      if (performanceTiming.loadEventEnd === 0) {
        cy.log('Page did not fully load, skipping performance timing');
        return;
      }

      const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
      cy.log(`Page load time: ${loadTime} ms`);

      const testEndTime = Date.now();
      const testDuration = testEndTime - testStartTime;

      cy.task('logPerformanceTiming', {
        url,
        performanceTiming: {
          navigationStart: performanceTiming.navigationStart,
          loadEventEnd: performanceTiming.loadEventEnd,
        },
        loadTime,
        testDuration
      });
    });
  });

  after(() => {
    cy.task('generatePerformanceReport');
  });
});

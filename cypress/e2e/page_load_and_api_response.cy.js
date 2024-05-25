describe('Page Load and API Response Test', () => {
    it('measures page load performance and API response time', () => {
      const testStartTime = Date.now();
      const url = 'https://reqres.in/';
  
      cy.intercept('GET', '/api/users?page=2').as('apiRequest');
      cy.visit(url);
  
      cy.window().then((win) => {
        const performanceTiming = win.performance.timing;
  
        if (performanceTiming.loadEventEnd === 0) {
          cy.log('Page did not fully load, skipping performance timing');
          return;
        }
  
        const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
        cy.log(`Page load time: ${loadTime} ms`);
  
        cy.wait('@apiRequest').then((interception) => {
          const apiResponseTime = interception.response.duration;
          cy.log(`API response time: ${apiResponseTime} ms`);
  
          const testEndTime = Date.now();
          const testDuration = testEndTime - testStartTime;
  
          cy.task('logPerformanceTiming', {
            url,
            performanceTiming: {
              navigationStart: performanceTiming.navigationStart,
              loadEventEnd: performanceTiming.loadEventEnd,
            },
            loadTime,
            apiResponseTime,
            testDuration
          });
        });
      });
    });
  
    after(() => {
      cy.task('generatePerformanceReport');
    });
  });
  
  
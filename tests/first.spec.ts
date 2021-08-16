import {test, expect} from '@playwright/test';
import {
  VisualGridRunner, 
  Eyes,
  Target,
  Configuration,
  RectangleSize,
  BatchInfo,
  BrowserType,
  DeviceName,
  ScreenOrientation, ConsoleLogHandler, MatchLevel
} from '@applitools/eyes-playwright';

let eyes, runner;

test.describe('playwright', () => {

  test.beforeEach(async () => {

    // Create a runner with concurrency of 1

    runner = new VisualGridRunner(5);
    // Create Eyes object with the runner, meaning it'll be a Visual Grid eyes.
    eyes = new Eyes(runner);

    // Initialize the eyes configuration
    const configuration = new Configuration();

    // create a new batch info instance and set it to the configuration
    configuration.setBatch(new BatchInfo('Playwright Demo'))

    // Add browsers with different viewports
    configuration.addBrowser(1024, 768, BrowserType.CHROME);
    configuration.addBrowser(1024, 768, BrowserType.FIREFOX);
    configuration.addBrowser(1024, 768, BrowserType.IE_11);
    configuration.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
    configuration.addBrowser(1024, 768, BrowserType.SAFARI);

    // Add mobile emulation devices in Portrait mode
    configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
    configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);

    configuration.setMatchLevel(MatchLevel.Layout)

    // Set the configuration to eyes
    eyes.setConfiguration(configuration);
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  test('basic test', async ({page}) => {
    await page.goto('https://demo.applitools.com');

    // Call Open on eyes to initialize a test session
    await eyes.open(page, 'Demo App', 'Ultrafast grid demo', new RectangleSize(1024, 768));
    
    // check the login page with fluent api, see more info here
    // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html
    await eyes.check('Login Window', Target.window().fully());

    // Click the "Log in" button.
    await page.click("#log-in");

    // Check the app page
    await eyes.check('App Window', Target.window().fully());

    // Call Close on eyes to let the server know it should display the results
    await eyes.close();
  });

  test.afterEach(async () => {
   await eyes.abortIfNotClosed()
    // we pass false to this method to suppress the exception that is thrown if we
    // find visual differences
    // const testResults = await eyes.close(throwEx)
    const results = await runner.getAllTestResults(true);
    console.log(results);
  });

});
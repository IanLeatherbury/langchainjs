import { Tool } from "tools/base.js";
import { GetAllDealsInDefaultPipeline } from "../hubspot.js";


describe('GetAllDealsInDefaultPipeline Integration Test', () => {
  let getAllDealsTool: Tool;

  beforeAll(() => {
    getAllDealsTool = new GetAllDealsInDefaultPipeline();
  });

  test('should fetch deals in the default pipeline', async () => {
    const pipeline = 'default';

    const dealsJson = await getAllDealsTool.call(pipeline);
    const deals = JSON.parse(dealsJson);

    expect(deals).toBeDefined();
    expect(Array.isArray(deals)).toBe(true);
  });
});

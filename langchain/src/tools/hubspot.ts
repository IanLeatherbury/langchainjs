import {
  PublicObjectSearchRequest,
  SimplePublicObject,
} from "@hubspot/api-client/lib/codegen/crm/deals";
import * as hubspot from "@hubspot/api-client";
import { Tool } from "./base.js";

class GetAllDealsInDefaultPipeline extends Tool {
  name = "GetAllDealsInDefaultPipeline";

  description = "Fetches all deals in the default pipeline";

  async _call(pipeline: string): Promise<string> {
    const allDeals = await this.getAllDealsInDefaultPipeline(pipeline);
    return JSON.stringify(allDeals);
  }

  private async getAllDealsInDefaultPipeline(
    pipeline: string
  ): Promise<SimplePublicObject[]> {
    const createRequest = (offset: number): PublicObjectSearchRequest => ({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "pipeline",
              operator: "EQ",
              value: pipeline,
            },
          ],
        },
      ],
      sorts: ["closedate"],
      properties: [
        "closedate",
        "pipeline",
        "dealname",
        "amount",
        "dealstage",        
      ],
      limit: 100,
      after: offset,
    });

    const dealArray: SimplePublicObject[] = [];
    let pageOffset = 0;

    let hasMore = true;

    while (hasMore) {
      const result = await this.getClient().crm.deals.searchApi.doSearch(
        createRequest(pageOffset)
      );

      dealArray.push(...result.results);

      pageOffset = parseInt(
        result.paging?.next?.after ? (result.paging?.next?.after as any) : 0,
        10
      );
      

      hasMore = pageOffset !== 0;
      if (!hasMore) break;
    }

    return dealArray;
  }

  private getClient(): hubspot.Client {
    let client: hubspot.Client | undefined;
    
    if (client === undefined) {
      client = new hubspot.Client({
        // eslint-disable-next-line no-process-env
        accessToken: process.env.HUBSPOT_API_KEY as string,
      });
    }
    return client;
  }
}

export { GetAllDealsInDefaultPipeline };
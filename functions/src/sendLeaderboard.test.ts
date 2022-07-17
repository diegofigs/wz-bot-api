
import assert from "assert";
import sinon from "sinon";
import Discord from "discord.js";
import * as api from "./api";

const stubGetRebirthBulk = sinon.stub(api, "getRebirthBulk");
const stubWebhookClient = sinon.createStubInstance(Discord.WebhookClient);
sinon.stub(Discord, "WebhookClient").returns(stubWebhookClient);
sinon.mock(Discord.MessageEmbed);

import { sendLeaderboard } from "./index";

const MESSAGE = "message";

describe("sendLeaderboard", () => {
  const jsonObject = JSON.stringify({ data: MESSAGE });
  const jsonBuffer = Buffer.from(jsonObject).toString("base64");
  const pubsubMessage = { data: jsonBuffer, publishTime: new Date() };

  let stubLog: sinon.SinonStub<[message?: any, ...optionalParams: any[]], void>;
  let stubError: sinon.SinonStub<[message?: any, ...optionalParams: any[]], void>;
  const stubConsole = () => {
    stubLog = sinon.stub(console, "log");
    stubError = sinon.stub(console, "error");
  };
  const restoreConsole = () => {
    stubLog.restore();
    stubError.restore();
  };
  beforeEach(stubConsole);
  afterEach(restoreConsole);

  it("should send leaderboard embeds to webhook channel", async () => {
    stubGetRebirthBulk.resolves({ byKills: [], byKDR: [] });

    await sendLeaderboard(pubsubMessage);

    assert(stubGetRebirthBulk.calledOnce);
    assert(stubWebhookClient.send.calledOnce);
    assert(stubWebhookClient.send.lastCall.firstArg);
  });
});

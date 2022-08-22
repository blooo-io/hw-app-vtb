import {
  openTransportReplayer,
  RecordStore,
} from "@ledgerhq/hw-transport-mocker";
import VTB from "../src/Vtb";

test("Vtb init", async () => {
  const transport = await openTransportReplayer(RecordStore.fromString(""));
  const dot = new VTB(transport);
  expect(dot).not.toBe(undefined);
});

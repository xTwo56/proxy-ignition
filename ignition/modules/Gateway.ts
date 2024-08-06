import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GatewayModule", (m) => {

  const gateway = m.contract("Gateway", [])
  const response = m.call(gateway, "getAddress")
  console.log("contract response: " + response)
  console.log("id: " + gateway.id)
  console.log("value: " + gateway.value)
  console.log("future: " + gateway)
  return { gateway };
});


import Fastflux from "../../dist-node/index";
import TodoStore from "./todo-store";

const app = new Fastflux.Application({
  stores: {
    "todos": TodoStore
  }
});
Fastflux.services.MessageHistory.setUp(app);

export default app;

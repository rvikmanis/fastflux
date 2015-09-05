import {Application, MessageHistory} from "../../dist-node/index";
import TodoStore from "./todo-store";

const app = new Application({
  stores: {
    "todos": TodoStore
  }
});
MessageHistory.setUp(app);
export default app;

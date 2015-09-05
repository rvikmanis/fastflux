import {Application} from "../../dist-node/index";
import TodoStore from "./todo-store";

const app = new Application({
  stores: {
    "todos": TodoStore
  }
});
export default app;

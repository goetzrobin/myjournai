import {createClient} from "~myjournai/auth";
import {eventHandler} from "h3";

export default eventHandler(async (event) => {
    const {auth} = createClient(event);
    await auth.signOut();
});

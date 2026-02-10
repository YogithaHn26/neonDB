
import { hash } from "bcrypt";

async function main() {
    console.log("Testing bcrypt...");
    try {
        const h = await hash("password", 10);
        console.log("Bcrypt success:", h);
    } catch (e) {
        console.error("Bcrypt failed:", e);
    }
}
main();

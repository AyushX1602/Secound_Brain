import { Button } from "../components/button";
import { Input } from "../components/input";


export function signin() {
    return <div className="h-screen w-screen bg-grey-200 flex
    justify-center items-center">
        <div className="bg-white p-8 rounded-lg min-w-48 p-8">
        <Input placeholder="Username"/>
        <Input placeholder="Password"/>
        <div className="flex justify-center pt-4">
        <Button loading={false} variant="primary" text="Sign In" fullWidth={true}/>
        </div>
     </div>
    </div>
}
export default signin;
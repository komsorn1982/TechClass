import {notFound} from "next/navigation";
import {ScienceActivityPage} from "./ScienceActivityPage";
import "../../lesson.css";
import "../../discovery.css";
import "../../detective.css";

export default async function ActivityRoute({params}:{params:Promise<{stage:string}>}){
 const{stage}=await params,value=Number(stage);
 if(!Number.isInteger(value)||value<1||value>8)notFound();
 return <ScienceActivityPage stage={value-1}/>;
}

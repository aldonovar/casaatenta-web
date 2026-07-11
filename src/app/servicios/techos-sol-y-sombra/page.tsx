import type { Metadata } from "next";
import { getServicePage } from "@/data/services-pages";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";
const data=getServicePage("techos-sol-y-sombra")!;
export const metadata:Metadata={title:data.seo.title,description:data.seo.description,keywords:data.seo.keywords};
export default function Page(){return <ServiceDetailLayout data={data}/>;}
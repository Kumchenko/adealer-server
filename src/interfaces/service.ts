import { Service } from "@prisma/client";
import { Request } from "express"

export type ServiceUniqueData = Pick<Service, 'modelId' | 'componentId' | 'qualityId'>

export type ServicesGetRequest = Request<{}, {}, {}, Partial<ServiceUniqueData>>
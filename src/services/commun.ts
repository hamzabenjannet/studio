import { API_URL } from "@/app/consts";
import { StatusEnum } from "@/enums/status.enum";
import { toast } from "@/hooks/use-toast";

export class DatasetFilterDtoPaginationParams {
  perPage?: string = "10";
  offset?: string = "0";
  page?: string = "1";
  sortField?: string = "_id";
  sortOrder?: string = "asc";
}

export class DatasetFilterDto {
  attributes: Record<string, string | undefined | null | number | boolean> = {};
  pagination?: DatasetFilterDtoPaginationParams;
  wildcard?: string = "true";
}

export function buildFetchElements<IXEntity extends {}>({
  setElements = (_elements: IXEntity[]) => {},
  setTotalPages = (_totalPages: number) => {},
  datasetFetchMethod = (filterDto: DatasetFilterDto): Promise<Response> =>
    Promise.resolve(filterDto && new Response()),
  datasetFetchResponseItemsAttr = "users",
}: {
  setElements?: (elements: IXEntity[]) => void;
  setTotalPages?: (totalPages: number) => void;
  datasetFetchMethod?: (filterDto: DatasetFilterDto) => Promise<Response>;
  datasetFetchResponseItemsAttr?: string;
}) {
  return async ({
    itemsPerPage = undefined,
    currentPage = undefined,
  }: {
    itemsPerPage?: number;
    currentPage?: number;
  } = {}): Promise<IXEntity[]> => {
    const filterDto: DatasetFilterDto = {
      attributes: {},
      pagination: {
        perPage: (itemsPerPage && itemsPerPage.toString()) || undefined,
        // offset: "0",
        page: (currentPage && currentPage.toString()) || undefined,
        sortField: "_id",
        sortOrder: "desc",
      },
      wildcard: "true",
    };

    const response = await datasetFetchMethod(filterDto);
    const data = await response.json();
    console.debug("response data", data);

    const {
      [datasetFetchResponseItemsAttr]: elements = [],
    }: { [datasetFetchResponseItemsAttr]: IXEntity[] | undefined } = data;

    if (elements) {
      setElements(elements);
    }
    if (data?.pagination?.totalPages) {
      setTotalPages(data.pagination.totalPages);
    }

    return elements;
  };
}

export async function fetchWrapper({
  method = "POST",
  url = `${API_URL}/`,
  body = undefined,
  headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
}: {
  method?: string;
  url?: string;
  body?: string | undefined | null;
  headers?: Record<string, string | undefined | null>;
}) {
  const response = await fetch(url, {
    method,
    headers: Object.fromEntries(
      Object.entries(headers).filter(([, v]) => v != null),
    ) as Record<string, string>,
    body,
  });
  const data = await response.json();
  return data;
}

export const buildItemInitState = <IEntityType extends {}>({
  EntityClass,
}: {
  EntityClass: new () => IEntityType;
}) => {
  const itemInitState: IEntityType = Object.fromEntries(
    Object.entries(new EntityClass()).map(([key, value]) => [key, value]),
  ) as unknown as IEntityType;

  return itemInitState;
};

export const serviceUpdateEntity = async <IEntity extends { _id?: string }>({
  formDataDto,
  gatewayService = (entityPayload: Record<string, any>) =>
    Promise.resolve(entityPayload as IEntity),
}: {
  formDataDto: IEntity;
  gatewayService: (entityPayload: Record<string, any>) => Promise<IEntity>;
}) => {
  const updatedEntityData: IEntity = await gatewayService(
    formDataDto as Record<string, any>,
  );
  const { message } = updatedEntityData as IEntity & { message?: string };

  if (!updatedEntityData?._id) {
    toast({
      title: message || "Error while updating",
      variant: "destructive",
    });
    return;
  }

  if (!updatedEntityData?._id) {
    toast({
      title: message || "Error while updating",
      variant: "destructive",
    });
    return;
  }
  // display a success toast
  toast({
    title: message || "updated successfully",
    variant: "default",
  });
};

export const serviceCreateEntity = async <IEntity extends { _id?: string }>({
  formDataDto,

  gatewayService = (entityPayload: Record<string, any>) =>
    Promise.resolve(entityPayload as IEntity),
}: {
  formDataDto: IEntity;
  gatewayService: (entityPayload: Record<string, any>) => Promise<IEntity>;
}) => {
  const createdEntityData = await gatewayService(
    formDataDto as Record<string, any>,
  );
  const { message } = createdEntityData as IEntity & { message?: string };

  if (!createdEntityData?._id) {
    toast({
      title: message || "Error while creating",
      variant: "destructive",
    });
    return;
  }

  // display a success toast
  toast({
    title: message || "created successfully",
    variant: "default",
  });
};

export interface IBaseEntity {
  _id?: number | string | undefined;
  status?: StatusEnum | undefined;
  createdAt?: string;
  archivedAt?: string;
}

export const handleFormInputChange = <IEntity extends IBaseEntity>({
  setFormData,
}: {
  setFormData: (prev: any) => void;
}) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { entityAttrName } = e.target.dataset;
    setFormData((prev: IEntity) => ({
      ...prev,
      ...(entityAttrName ? { [entityAttrName]: value } : {}),
    }));
  };
};

export const handleSaveEntity = <IEntity extends IBaseEntity>({
  formData,
  createEntityService = (entityPayload: Record<string, any>) =>
    Promise.resolve(entityPayload as IEntity),
  updateEntityService = (entityPayload: Record<string, any>) =>
    Promise.resolve(entityPayload as IEntity),
}: {
  formData?: IEntity | undefined;
  createEntityService: (entityPayload: Record<string, any>) => Promise<IEntity>;
  updateEntityService: (entityPayload: Record<string, any>) => Promise<IEntity>;
}) => {
  return (event?: React.FormEvent) => {
    event && event.preventDefault();

    if (!formData) {
      return;
    }

    Object.assign(formData, {
      ownerString: undefined,
    });

    // format the form data
    const formDataDto = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (key === "password" || key === "_id") {
          return [key, value];
        }
        return [key, typeof value === "string" ? value.toLowerCase() : value];
      }),
    );

    // if formData?._id <= 0, then it is a new item
    if (formData?._id === -1) {
      serviceCreateEntity({
        gatewayService: createEntityService,
        formDataDto,
      });
    }

    // we update the item
    if (formDataDto?._id >= 0) {
      serviceUpdateEntity({
        gatewayService: updateEntityService,
        formDataDto,
      });
    }

    return Promise.resolve(formDataDto);
  };
};

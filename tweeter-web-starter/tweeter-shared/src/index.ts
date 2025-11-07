//domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

//util
export { FakeData } from "./util/FakeData";

//DTOs
export type { UserDTO } from "./model/dto/UserDTO";
export type { AuthTokenDTO } from "./model/dto/AuthTokenDTO";

//requests
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { UserItemRequest } from "./model/net/request/UserItemRequest";
export type { AuthRequest } from "./model/net/request/AuthRequest";
export type { RegisterRequest } from "./model/net/request/RegisterRequest";

//responses
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { UserItemResponse } from "./model/net/response/UserItemResponse";
export type { AuthResponse } from "./model/net/response/AuthResponse";

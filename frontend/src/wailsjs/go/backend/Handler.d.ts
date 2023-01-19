// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {connections} from '../models';
import {app} from '../models';
import {backend} from '../models';
import {interactor} from '../models';
import {jsonrpc} from '../models';

export function APIV2DeleteAPIToken(arg1:string):Promise<void>;

export function APIV2DescribeAPIToken(arg1:string):Promise<connections.TokenDescription>;

export function APIV2GenerateAPIToken(arg1:connections.GenerateAPITokenParams):Promise<connections.Token>;

export function APIV2ListAPITokens():Promise<connections.ListAPITokensResult>;

export function GetAppConfig():Promise<app.Config>;

export function GetCurrentServiceInfo():Promise<backend.GetCurrentServiceInfo>;

export function GetLatestRelease():Promise<backend.LatestRelease>;

export function GetVersion():Promise<backend.GetVersionResponse>;

export function InitialiseApp(arg1:backend.InitialiseAppRequest):Promise<void>;

export function IsAppInitialised():Promise<boolean>;

export function RespondToInteraction(arg1:interactor.Interaction):Promise<void>;

export function SearchForExistingConfiguration():Promise<backend.SearchForExistingConfigurationResponse>;

export function StartService(arg1:backend.StartServiceRequest):Promise<void>;

export function StopService():Promise<void>;

export function SubmitWalletAPIRequest(arg1:jsonrpc.Request):Promise<jsonrpc.Response>;

export function UpdateAppConfig(arg1:app.Config):Promise<void>;

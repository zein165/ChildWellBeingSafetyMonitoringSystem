export enum ApplicationStatus {
  INSTALLED = 'INSTALLED',
  REMOVED = 'REMOVED',
}

export interface Application {
  id: string;
  childId: string;
  packageName: string;
  name: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetChildApplicationsResponse {
  childId: string;
  applications: Application[];
}

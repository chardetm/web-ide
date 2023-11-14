import {
  ExportV2,
  ExportV2Activity,
  Settings,
} from "./types";

type PartialStudentSettings = Partial<Settings>;
type PartialExportV2Activity = Exclude<ExportV2Activity, "studentSettings"> & {
  studentSettings: PartialStudentSettings;
};

export type PartialExportV2Data = Exclude<ExportV2, "activity"> & {
  activity: PartialExportV2Activity;
};

export function dataWithMissingFields(data: PartialExportV2Data): ExportV2 {
  const newData = { ...data };
  if (newData.activity.studentSettings.autoCloseTags === undefined) {
    newData.activity.studentSettings.autoCloseTags = true;
  }
  if (!newData.activity.studentSettings.lineWrap === undefined) {
    newData.activity.studentSettings.lineWrap = true;
  }
  return newData;
}

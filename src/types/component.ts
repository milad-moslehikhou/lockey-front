import { AlertColor } from '@mui/lab'


export type AlertStateType = {
  open?: boolean,
  severity?: AlertColor,
  message?: string,
};
export type SnackbarContextType = {
  openSnackbar: ({ severity, message }: AlertStateType) => void,
}

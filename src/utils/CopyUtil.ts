import {showGlobalAlert} from "@site/src/utils/ShowAlert";

export const copyToClipboard = async (
  content: string,
  successMsg: string,
  errorMsg: string
) => {
  try {
    await navigator.clipboard.writeText(content);
    showGlobalAlert(successMsg, 'success');
  } catch (error) {
    showGlobalAlert(errorMsg, 'error');
  }
};

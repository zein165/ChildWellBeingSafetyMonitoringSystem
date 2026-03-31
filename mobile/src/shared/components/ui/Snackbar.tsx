import { Snackbar as PaperSnackbar } from 'react-native-paper';

type Props = {
  visible: boolean;
  icon?: string;
  duration?: number;
  text: string;
  onDismiss: () => void;
};

export default function Snackbar({
  visible,
  icon,
  duration = 5000,
  text,
  onDismiss,
}: Props) {
  return (
    <PaperSnackbar
      visible={visible}
      icon={icon}
      duration={duration}
      onDismiss={onDismiss}
    >
      {text}
    </PaperSnackbar>
  );
}

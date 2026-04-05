import { View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { colors } from '../../constants/theme/colors';

type Props = {
    progress: number; // 0.0 to 1.0
    color: string;
};

export default function CustomProgressBar({ progress, color }: Props) {
    return (
        <ProgressBar
            progress={progress}
            color={color}
            style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.grey,
            }}
        />
    );
}
import { TouchableOpacity } from 'react-native';
import Icon from './Icon';

type Props = {
    name: string;
    color?: string;
    size?: number;
    onPress?: () => void;
};

export default function IconButton({ name, color, size, onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Icon name={name} color={color} size={size} />
        </TouchableOpacity>
    );
}
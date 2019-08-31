import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Main } from '../screens/Main';

export const AppNavigator = createAppContainer(
  createStackNavigator(
    { Main },
    {
      initialRouteName: 'Main',
      transparentCard: true,
      cardStyle: {
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
      },
    },
  ),
);

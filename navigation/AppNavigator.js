import { createAppContainer, createStackNavigator } from 'react-navigation';
import Main from '../screens/Main';
import { Detail } from '../screens/Detail';

export const AppNavigator = createAppContainer(
  createStackNavigator(
    { Main, Detail },
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

import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  ActionIcon,
  Paper,
  List,
  ThemeIcon,
  Alert,
  Box,
  Button,
  MantineProvider,
  Space,
} from '@mantine/core';
import { Bulb, ChartLine, CircleCheck, CircleX, FileSpreadsheet } from 'tabler-icons-react';
import { WeightForm } from './forms/WeightForm';
import { CaliperForm } from './forms/CaliperForm';
import { GirthForm } from './forms/GirthForm';
import { useGlobalStatebook } from 'statebook';
import { NotificationsProvider } from '@mantine/notifications';

function App() {
  const weight = useGlobalStatebook('weight');
  const caliper = useGlobalStatebook('caliper');
  const girth = useGlobalStatebook('girth');

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    const weightData = weight.state.data as { [key: string]: string };
    Object.keys(weightData).forEach((day) => {
      csvContent += `weight,${day},${weightData[day]}\r\n`;
    });
    csvContent += `,,\r\n`;
    const caliperData = caliper.state.data as { [key: string]: string };
    Object.keys(caliperData).forEach((site) => {
      csvContent += `caliper,${site},${caliperData[site]}\r\n`;
    });
    csvContent += `,,\r\n`;
    const girthData = girth.state.data as { [key: string]: string };
    Object.keys(girthData).forEach((area) => {
      csvContent += `girth,${area},${girthData[area]}\r\n`;
    });
    console.log({ csvContent });
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <MantineProvider>
      <NotificationsProvider>
        <Container>
          <Stack>
            <Group direction="column" position="center" spacing={10} mt={40}>
              <ActionIcon size={68} variant="outline" color={'grape'}>
                <ChartLine size={64} />
              </ActionIcon>
              <Text align="center" color={'gray'} variant="text">
                <Title sx={{ width: 300 }} order={2}>
                  Body Composition Tracking
                </Title>
              </Text>
            </Group>
            <WeightForm />
            <CaliperForm />
            <GirthForm />

            <Paper shadow="xs" p="xl" my="lg" withBorder>
              <Stack spacing={'sm'}>
                <Text align="center" color={'gray'} variant="text">
                  <Title order={3}>Export To Datasheet</Title>
                </Text>
                <Alert mt={'sm'} icon={<Bulb size={16} />} color="yellow">
                  Don't forget to press save in every section after submitting your data
                </Alert>
                <Box sx={{ width: '100%' }} my="sm">
                  <Text color={'gray'} variant="text" mb="sm">
                    <Title order={5}>Submitted Forms</Title>
                  </Text>
                  <List spacing="xs" size="sm" center>
                    <List.Item
                      icon={
                        <ThemeIcon color={weight.state.loaded ? 'teal' : 'red'} size={24} radius="xl">
                          {weight.state.loaded ? <CircleCheck size={16} /> : <CircleX size={16} />}
                        </ThemeIcon>
                      }
                    >
                      Weight Weekly Input
                    </List.Item>
                    <List.Item
                      icon={
                        <ThemeIcon color={caliper.state.loaded ? 'teal' : 'red'} size={24} radius="xl">
                          {caliper.state.loaded ? <CircleCheck size={16} /> : <CircleX size={16} />}
                        </ThemeIcon>
                      }
                    >
                      Caliper Weekly Input
                    </List.Item>
                    <List.Item
                      icon={
                        <ThemeIcon color={girth.state.loaded ? 'teal' : 'red'} size={24} radius="xl">
                          {girth.state.loaded ? <CircleCheck size={16} /> : <CircleX size={16} />}
                        </ThemeIcon>
                      }
                    >
                      Girth Weekly Input
                    </List.Item>
                  </List>
                </Box>
                <Button
                  disabled={!weight.state.loaded || !caliper.state.loaded || !girth.state.loaded}
                  leftIcon={<FileSpreadsheet size={18} />}
                  onClick={exportCSV}
                  size="xs"
                  color={'cyan'}
                >
                  Export
                </Button>
              </Stack>
            </Paper>
            <Space h={100} />
          </Stack>
        </Container>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;

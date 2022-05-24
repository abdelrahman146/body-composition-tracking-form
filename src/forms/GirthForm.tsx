import { Paper, Stack, Title, Text, Group, Badge, ActionIcon, Button, TextInput, ThemeIcon, Center } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useGlobalStatebook } from 'statebook';
import { CircleCheck, DeviceFloppy, Ruler } from 'tabler-icons-react';
import { z } from 'zod';

const areas = ['chest', 'waist', 'hips', 'legs', 'arms'];

const formSchema = z.object(
  areas.reduce(
    (schema, area) => ({
      ...schema,
      [area]: z
        .string()
        .min(1, 'Required')
        .regex(/^$|^[0-9]+$|^([0-9]+\.?[0-9]*|\.[0-9]+)$/, 'Invalid Input')
        .max(6, 'Invalid Input'),
    }),
    {}
  )
);

export function GirthForm() {
  const girth = useGlobalStatebook('girth');

  const form = useForm({
    schema: zodResolver(formSchema),
    initialValues: areas.reduce((obj, area) => ({ ...obj, [area]: '' }), {}),
  });

  const handleSubmit = (values: typeof form.values) => {
    girth.setData(values);
    girth.setLoaded(true);
    showNotification({
      title: 'Saved!',
      message: 'Girth Weekly Input Saved',
      color: 'violet',
      icon: <Ruler />,
    });
  };

  return (
    <Paper shadow="xs" p="lg" my="lg" withBorder>
      <Group align={'center'} spacing={'xs'}>
        <ActionIcon color={'violet'} variant={'transparent'}>
          <Ruler />
        </ActionIcon>
        <Title order={3}>Girth Weekly Input</Title>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack my="lg">
          {areas.map((area) => {
            return (
              <Group key={area}>
                <Badge variant="light" sx={{ width: '105px' }} color="violet" radius="sm" size="lg">
                  <Text size="xs">{area}</Text>
                </Badge>
                <TextInput
                  rightSection={
                    <Text color={'dimmed'} weight="bold" size="sm" pr={'sm'}>
                      CM
                    </Text>
                  }
                  sx={{ flex: 1 }}
                  variant="filled"
                  size="xs"
                  placeholder="Ex: 75.4"
                  {...form.getInputProps(area as never)}
                />
              </Group>
            );
          })}
          <Button leftIcon={<DeviceFloppy size={18} />} type="submit" size="xs" color={'violet'}>
            Save
          </Button>
          <Center>
            {girth.state.loaded && (
              <ThemeIcon color="teal" size={32} radius="xl">
                <CircleCheck size={24} />
              </ThemeIcon>
            )}
          </Center>
        </Stack>
      </form>
    </Paper>
  );
}

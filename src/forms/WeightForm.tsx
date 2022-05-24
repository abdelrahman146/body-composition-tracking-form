import { Paper, Stack, Title, Text, Group, Badge, ActionIcon, Button, TextInput, Center, ThemeIcon } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useGlobalStatebook } from 'statebook';
import { CircleCheck, DeviceFloppy, Scale } from 'tabler-icons-react';
import { z } from 'zod';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const formSchema = z.object(
  days.reduce(
    (schema, day) => ({
      ...schema,
      [day]: z
        .string()
        .min(1, { message: 'Required' })
        .regex(/^$|^[0-9]+$|^([0-9]+\.?[0-9]*|\.[0-9]+)$/, 'Invalid Number')
        .max(6, 'Invalid Weight'),
    }),
    {}
  )
);

export function WeightForm() {
  const weight = useGlobalStatebook('weight');

  const form = useForm({
    schema: zodResolver(formSchema),
    initialValues: days.reduce((obj, day) => ({ ...obj, [day]: '' }), {}),
  });

  const handleSubmit = (values: typeof form.values) => {
    weight.setData(values);
    weight.setLoaded(true);
    showNotification({
      title: 'Saved!',
      message: 'Weight Weekly Input Saved',
      color: 'cyan',
      icon: <Scale />,
    });
  };

  return (
    <Paper shadow="xs" p="lg" my="lg" withBorder>
      <Group align={'center'} spacing={'xs'}>
        <ActionIcon color={'cyan'} variant={'transparent'}>
          <Scale />
        </ActionIcon>
        <Title order={3}>Weight Weekly Input</Title>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack my="lg">
          {days.map((day) => {
            return (
              <Group key={day}>
                <Badge variant="light" sx={{ width: '105px' }} color="cyan" radius="sm" size="lg">
                  <Text size="xs">{day}</Text>
                </Badge>
                <TextInput
                  rightSection={
                    <Text color={'dimmed'} weight="bold" size="sm" pr={'sm'}>
                      KG
                    </Text>
                  }
                  sx={{ flex: 1 }}
                  variant="filled"
                  size="xs"
                  placeholder="Ex: 75.4"
                  {...form.getInputProps(day as never)}
                />
              </Group>
            );
          })}
          <Button leftIcon={<DeviceFloppy size={18} />} type="submit" size="xs" color={'cyan'}>
            Save
          </Button>
          <Center>
            {weight.state.loaded && (
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

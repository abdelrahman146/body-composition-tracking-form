import { Paper, Stack, Title, Text, Group, Badge, ActionIcon, Button, TextInput, Tooltip, Alert, Center, ThemeIcon } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useGlobalStatebook } from 'statebook';
import { Angle, Bulb, CircleCheck, DeviceFloppy, QuestionMark } from 'tabler-icons-react';
import { z } from 'zod';

const sites = [
  { name: 'Chest', id: 'chest', desc: 'Diagonal fold, midway between upper armpit and nipple' },
  { name: 'Midaxillary', id: 'midaxillary', desc: 'Horizontal fold, directly below armpit' },
  { name: 'Bicep', id: 'bicep', desc: 'Vertical fold, halfway between shoulder and elbow, directly on bicep' },
  { name: 'Abdominal', id: 'abdominal', desc: 'Vertical fold, one inch to the right of navel' },
  { name: 'Suprailiac', id: 'suprailiac', desc: 'Diagonal fold, directly above iliac crest' },
  { name: 'Thigh', id: 'thigh', desc: 'Vertical fold, midway between knee cap and top of thigh' },
  { name: 'Calf', id: 'calf', desc: 'Vertical fold, inside of leg on largest part of calf' },
  { name: 'Subscapular', id: 'subscapular', desc: 'Diagonal fold, directly below shoulder blade' },
  { name: 'Tricep', id: 'tricep', desc: 'Vertical fold, midway between elbow and shoulder' },
  { name: 'Lower Back', id: 'Lowerback', desc: 'Horizontal fold, directly over the kidneys, and 2 inches to the right of spine' },
];

const formSchema = z.object(
  sites.reduce(
    (schema, site) => ({
      ...schema,
      [site.id]: z
        .string()
        .min(1, 'Required')
        .regex(/^$|^[0-9]+$|^([0-9]+\.?[0-9]*|\.[0-9]+)$/, 'Invalid Input')
        .max(6, 'Invalid Input'),
    }),
    {}
  )
);

export function CaliperForm() {
  const caliper = useGlobalStatebook('caliper');

  const form = useForm({
    schema: zodResolver(formSchema),
    initialValues: sites.reduce((obj, site) => ({ ...obj, [site.id]: '' }), {}),
  });

  const handleSubmit = (values: typeof form.values) => {
    caliper.setData(values);
    caliper.setLoaded(true);
    showNotification({
      title: 'Saved!',
      message: 'Caliper Weekly Input Saved',
      color: 'teal',
      icon: <Angle />,
    });
  };

  return (
    <Paper shadow="xs" p="lg" my="lg" withBorder>
      <Group align={'center'} spacing={'xs'}>
        <ActionIcon color={'teal'} variant={'transparent'}>
          <Angle />
        </ActionIcon>
        <Title order={3}>Caliper Weekly Input</Title>
      </Group>
      <Alert mt={'sm'} icon={<Bulb size={16} />} color="teal">
        For steps{' '}
        <Text component="a" variant="link" href="http://www.linear-software.com/malesites.html">
          Click Here
        </Text>
      </Alert>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack my="lg">
          {sites.map((site) => {
            return (
              <Group key={site.id}>
                <Badge variant="light" sx={{ width: '120px' }} color="teal" radius="sm" size="lg">
                  <Text size="xs">{site.name}</Text>
                </Badge>
                <TextInput
                  rightSection={
                    <Tooltip placement="end" label={site.desc} color="dark" withArrow>
                      <ActionIcon variant="filled" color="gray" size="xs">
                        <QuestionMark />
                      </ActionIcon>
                    </Tooltip>
                  }
                  sx={{ flex: 1 }}
                  variant="filled"
                  size="xs"
                  placeholder="Ex: 32"
                  {...form.getInputProps(site.id as never)}
                />
              </Group>
            );
          })}
          <Button leftIcon={<DeviceFloppy size={18} />} type="submit" size="xs" color={'teal'}>
            Save
          </Button>
          <Center>
            {caliper.state.loaded && (
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

'use client';
import React from 'react';
import { useId } from "react";
import { useState, useEffect } from 'react';
import {
  Group,
  Button,
  Text,
  Container,
  Grid,
  Card,
  TextInput,
  Select,
  RangeSlider,
  Badge,
  Stack,
  Flex,
  Modal,
  Textarea,
  Box,
  UnstyledButton,
} from '@mantine/core';
import { AppShell } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconBuilding,
  IconUsers,
  IconMoneybag,
} from '@tabler/icons-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salaryFrom: string;
  salaryTo: string;
  description: string;
  deadline: Date | string;
  postedDate: Date | string;
  createdAt: string;
  updatedAt: string;
  remote: boolean;
  isLPA: boolean;
}

const convertLPAToMonthlyK = (lpa: number) => (lpa * 100) / 12;
const convertMonthlyKToLPA = (monthlyK: number) => (monthlyK * 12) / 100;

const transformJob = (job: any): Job => {
  const salaryFromRaw = job.salaryRange ?? job.salaryrange ?? '0';
  const salaryToRaw = job.salaryrange2 ?? salaryFromRaw;

  const salaryFrom = parseFloat(String(salaryFromRaw).replace(/[^0-9.]/g, '')) || 0;
  const salaryTo = parseFloat(String(salaryToRaw).replace(/[^0-9.]/g, '')) || salaryFrom;

  return {
    id: job.id || crypto.randomUUID(),
    title: job.title ?? 'Untitled Job',
    company: job.company ?? 'Unknown Company',
    location: job.location ?? 'Remote',
    type: job.type ?? 'Full-time',
    experience: job.experience ?? '1-3 yr Exp',
    salaryFrom: salaryFrom.toString(),
    salaryTo: Math.max(salaryFrom, salaryTo).toString(),
    description: job.description ?? 'No description provided',
    deadline: job.applicationDeadline ? new Date(job.applicationDeadline) : new Date(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    postedDate: job.createdAt ? new Date(job.createdAt) : new Date(),
    remote: Boolean(job.isRemote),
    isLPA: true,
  };
};

export default function HomePage() {
  const formId = useId();
  const [opened, { open, close }] = useDisclosure(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: '',
    salaryRange: [5, 100] as [number, number],
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');

        const data = await res.json();
        const transformedJobs: Job[] = data.map(transformJob);

        setJobs(transformedJobs);
        setFilteredJobs(transformedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      setFilteredJobs([]);
      return;
    }

    let filtered = [...jobs];

    if (filters.title) {
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((job) => job.type === filters.type);
    }

    filtered = filtered.filter((job) => {
      const jobSalaryFrom = parseFloat(job.salaryFrom) || 0;
      const jobSalaryTo = parseFloat(job.salaryTo) || 0;
      const minMonthlyK = convertLPAToMonthlyK(jobSalaryFrom);
      const maxMonthlyK = convertLPAToMonthlyK(jobSalaryTo);
      return (
        maxMonthlyK >= filters.salaryRange[0] &&
        minMonthlyK <= filters.salaryRange[1]
      );
    });

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  useEffect(() => {
    document.querySelectorAll('[fdprocessedid]').forEach((el) =>
      el.removeAttribute('fdprocessedid')
    );
  }, []);

  const form = useForm({
    initialValues: {
      title: '',
      company: '',
      location: '',
      type: '',
      salaryFrom: '',
      salaryTo: '',
      description: '',
      deadline: new Date(),
    },
  });

  if (!mounted) return null;
const handleSubmit = async (values: any) => {
  const newJobPayload = {
    // Don't include id - let the backend auto-generate it
    title: values.title,
    company: values.company,
    location: values.location,
    type: values.type,
    salaryRange: values.salaryFrom ? String(values.salaryFrom) : '0',
    salaryrange2: values.salaryTo ? String(values.salaryTo) : String(values.salaryFrom ?? '0'),
    description: values.description,
    applicationDeadline: values.deadline,
    isRemote: true,
    isActive: true,
  };

  try {
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJobPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Server response:', errText);
      throw new Error('Failed to create job');
    }

    const savedJob = await res.json();
    setJobs((prev) => [transformJob(savedJob), ...prev]);
    close();
    form.reset();

    notifications.show({
      title: 'Job Created',
      message: 'New job has been added successfully',
      color: 'green',
    });
  } catch (error) {
    console.error('Error creating job:', error);

    notifications.show({
      title: 'Error',
      message: 'Failed to create job. Please try again.',
      color: 'red',
    });
  }
};
  
  const getCompanyLogo = (company: string) => {
    const normalized = company.toLowerCase();
    if (['amazon', 'swiggy'].includes(normalized)) {
      return `/logos/${normalized}.png`;
    }
    return '/logos/default.png';
  };

  return (
    <AppShell header={{ height: 70 }}>
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Flex justify="center" align="center" h="100%" gap="xl">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/logos/main.png"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            <Group gap="xl">
              <Text fw={500}>Home</Text>
              <Text fw={500}>Find Jobs</Text>
              <Text fw={500}>Find Talents</Text>
              <Text fw={500}>About us</Text>
              <Text fw={500}>Testimonials</Text>
            </Group>

            <Button onClick={open} color="violet" variant="filled" radius="xl">
              Create Jobs
            </Button>
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="xl">
          <div className="search-container">
            <Group grow>
              <TextInput
                placeholder="Search By Job Title, Role"
                leftSection={<IconSearch size={16} />}
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
              />
              <Select
                placeholder="Preferred Location"
                leftSection={<IconMapPin size={16} />}
                data={['Chennai', 'Onsite', 'Google', 'Remote']}
                value={filters.location}
                onChange={(value) =>
                  setFilters({ ...filters, location: value || '' })
                }
              />
              <Select
                placeholder="Job type"
                leftSection={<IconBriefcase size={16} />}
                data={['Full-time', 'Part-time', 'Contract', 'Internship']}
                value={filters.type}
                onChange={(value) =>
                  setFilters({ ...filters, type: value || '' })
                }
              />
              <Box>
                <Text size="sm" mb={8}>
                  Salary Per Month: ₹{filters.salaryRange[0]}k - ₹
                  {filters.salaryRange[1]}k (₹
                  {convertMonthlyKToLPA(filters.salaryRange[0]).toFixed(1)} - ₹
                  {convertMonthlyKToLPA(filters.salaryRange[1]).toFixed(1)} LPA)
                </Text>
                <RangeSlider
                  value={filters.salaryRange}
                  onChange={(value) =>
                    setFilters({ ...filters, salaryRange: value })
                  }
                  min={5}
                  max={100}
                  step={5}
                  color="black"
                  className="salary-range-slider"
                />
              </Box>
            </Group>
          </div>

          <Grid>
            {filteredJobs &&
              filteredJobs.map((job) => (
                <Grid.Col key={job.id} span={{ base: 12, md: 6, lg: 3 }}>
                  <Card className="job-card" shadow="sm" radius="md">
                    <Stack>
                      <Flex justify="space-between" align="center" mb="sm">
                        <img
                          src={getCompanyLogo(job.company)}
                          alt={job.company}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'contain',
                          }}
                        />

                        <Badge
                          className="job-badge"
                          size="lg"
                          styles={{
                            root: {
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                        >
                          24h Ago
                        </Badge>
                      </Flex>

                      <div>
                        <Text fw={600} size="lg" mb={4}>
                          {job.title}
                        </Text>
                        <div className="job-details">
                          <IconClock size={14} />
                          <Text size="sm">{job.experience}</Text>
                          <IconBuilding size={14} />
                          <Text size="sm">
                            {job.remote ? 'Onsite' : 'Remote'}
                          </Text>
                          <IconMoneybag size={14} />
                          <Text size="sm">₹{job.salaryFrom} LPA</Text>
                        </div>

                        <ul
                          className="job-description"
                          style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}
                        >
                          {job.description
                            .split('\n')
                            .map(
                              (line, index) =>
                                line.trim() !== '' && (
                                  <li key={index}>{line}</li>
                                )
                            )}
                        </ul>
                      </div>

                      <Button className="apply-btn" fullWidth>
                        Apply Now
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
          </Grid>

          {(!filteredJobs || filteredJobs.length === 0) && (
            <Text ta="center" c="dimmed" mt="xl">
              No jobs found matching your criteria.
            </Text>
          )}
        </Container>

        <Modal
          opened={opened}
          onClose={close}
          title={<Text fw={600} size="xl">Create Job Opening</Text>}
          size="lg"
          centered
          overlayProps={{ className: 'modal-overlay' }}
          classNames={{ content: 'create-job-modal' }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <div className="form-row">
                <TextInput
                  label="Job Title"
                  placeholder="Full Stack Developer"
                  {...form.getInputProps('title')}
                  required
                />
                <TextInput
                  label="Company Name"
                  placeholder="Amazon, Microsoft, Swiggy"
                  {...form.getInputProps('company')}
                  required
                />
              </div>

              <div className="form-row">
                <Select
                  label="Location"
                  placeholder="Choose Preferred Location"
                  data={['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Remote']}
                  {...form.getInputProps('location')}
                  required
                />
                <Select
                  label="Job Type"
                  placeholder="Full-time"
                  data={[
                    { value: 'Internship', label: 'Internship' },
                    { value: 'Full-time', label: 'Full-time' },
                    { value: 'Part-time', label: 'Part-time' },
                    { value: 'Contract', label: 'Contract' },
                  ]}
                  {...form.getInputProps('type')}
                  required
                />
              </div>

              <Flex gap="md" align="flex-start">
                <TextInput
                  label="Salary From"
                  placeholder="0"
                  {...form.getInputProps('salaryFrom')}
                  required
                  style={{ flex: 1 }}
                />
                <TextInput
                  label="Salary To"
                  placeholder="10,00,000"
                  {...form.getInputProps('salaryTo')}
                  required
                  style={{ flex: 1 }}
                />
                <DatePickerInput
                  label="Application Deadline"
                  placeholder="Pick date"
                  {...form.getInputProps('deadline')}
                  required
                  style={{ flex: 2 }}
                />
              </Flex>

              <Textarea
                label="Job Description"
                placeholder="Please share a description as per the candidate's know about the job role"
                minRows={4}
                {...form.getInputProps('description')}
                required
              />

              <Group justify="space-between" mt="xl">
                <Button variant="outline" className="save-draft-btn">
                  Save Draft ⌄
                </Button>
                <Button type="submit" className="publish-btn">
                  Publish ➤
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}
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
import { IconSearch, IconMapPin, IconBriefcase, IconClock, IconBuilding, IconUsers, IconMoneybag } from '@tabler/icons-react';

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
  deadline: Date|string;
  postedDate: Date|string;
  remote: boolean;
  isLPA: boolean;
}

// const initialJobs: Job[] = [
//   {
//     id: '1',
//     title: 'Full Stack Developer',
//     company: 'Amazon',
//     location: 'Chennai',
//     type: 'Full-time',
//     experience: '2+ 1-3 yr Exp',
//     salaryFrom: '8',
//     salaryTo: '12',
//     description: 'A user-friendly interface lets you browse stunning photos and videos.',
//     deadline: '2024-03-15',
//     postedDate: '2024-02-01',
//     remote: true,
//     isLPA: true
//   },
//   {
//     id: '2',
//     title: 'Node Js Developer',
//     company: 'Tesla',
//     location: 'Google',
//     type: 'Full-time',
//     experience: '2+ 1-3 yr Exp',
//     salaryFrom: '6',
//     salaryTo: '10',
//     description: 'A user-friendly interface lets you browse stunning photos and videos.',
//     deadline: '2024-03-20',
//     postedDate: '2024-02-05',
//     remote: true,
//     isLPA: true
//   },
//   {
//     id: '3',
//     title: 'UX/UI Designer',
//     company: 'Figma',
//     location: 'Onsite',
//     type: 'Contract',
//     experience: '2+ 1-3 yr Exp',
//     salaryFrom: '5',
//     salaryTo: '8',
//     description: 'A user-friendly interface lets you browse stunning photos and videos.',
//     deadline: '2024-03-20',
//     postedDate: '2024-02-05',
//     remote: false,
//     isLPA: true
//   },
//   {
//     id: '4',
//     title: 'Full Stack Developer',
//     company: 'Amazon',
//     location: 'Onsite',
//     type: 'Full-time',
//     experience: '2+ 1-3 yr Exp',
//     salaryFrom: '8',
//     salaryTo: '15',
//     description: 'A user-friendly interface lets you browse stunning photos and videos.',
//     deadline: '2024-03-20',
//     postedDate: '2024-02-05',
//     remote: false,
//     isLPA: true
//   }
// ];

const convertLPAToMonthlyK = (lpa) => {
  return (lpa * 100) / 12;
};

const convertMonthlyKToLPA = (monthlyK) => {
  return (monthlyK * 12) / 100;
};

export default function HomePage() {
  const formId = useId();
  const [opened, { open, close }] = useDisclosure(false);
  
  // ✅ Initialize jobs with initialJobs data
  const [jobs, setJobs] = useState<Job[]>([]);
const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: '',
    salaryRange: [5, 80] as [number, number]
  });
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      
      const data = await res.json();
      // Transform backend fields if necessary to match frontend expectations
      const transformedJobs: Job[] = data.map((job: any) => ({
        id: job.id || crypto.randomUUID(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        experience: '1-3 yr Exp', // or job.experience if exists
        salaryFrom: job.salaryRange?.toString() ?? '0',
        salaryTo: job.salaryrange2?.toString() ?? '0',
        description: job.description,
        deadline: job.applicationDeadline,
        postedDate: job.createdAt || new Date(),
        remote: job.isRemote,
        isLPA: true, // You can calculate this if needed
      }));

      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  fetchJobs();
}, []);


  // Filter jobs whenever filters or jobs change
  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      setFilteredJobs([]);
      return;
    }

    let filtered = [...jobs];

    if (filters.title) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }
    
    filtered = filtered.filter(job => {
      const jobSalaryFrom = job.salaryFrom ? parseFloat(job.salaryFrom.replace(/[^0-9.]/g, '')) : 0;
      const jobSalaryTo = job.salaryTo ? parseFloat(job.salaryTo.replace(/[^0-9.]/g, '')) : 0;
      
      const minMonthlyK = convertLPAToMonthlyK(jobSalaryFrom);
      const maxMonthlyK = convertLPAToMonthlyK(jobSalaryTo);

      return maxMonthlyK >= filters.salaryRange[0] && minMonthlyK <= filters.salaryRange[1];
    });

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  useEffect(() => {
    document.querySelectorAll("[fdprocessedid]").forEach(el =>
      el.removeAttribute("fdprocessedid")
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
    const newJob: Job = {
      id: crypto.randomUUID(), 
      title: values.title,
      company: values.company,
      location: values.location,
      type: values.type,
      experience: '1-3 yr Exp',
      salaryFrom: values.salaryFrom ? values.salaryFrom.toString() : '0',
      salaryTo: values.salaryTo ? values.salaryTo.toString() : '0',
      description: values.description,
      deadline: values.deadline,
      postedDate: new Date(),
      remote: true,
      isLPA: true
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      
      if (res.ok) {
        const savedJob = await res.json();
        // ✅ Add the new job to the current state
        setJobs(prev => [savedJob, ...prev]);
        
        close();
        form.reset();
        
        notifications.show({
          title: 'Job Created',
          message: 'New job has been added successfully',
          color: 'green'
        });
      } else {
        throw new Error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create job. Please try again.',
        color: 'red'
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

            <Button
              onClick={open}
              color="violet"
              variant="filled"
              radius="xl"
            >
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
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
              <Select
                placeholder="Preferred Location"
                leftSection={<IconMapPin size={16} />}
                data={['Chennai', 'Onsite', 'Google', 'Remote']}
                value={filters.location}
                onChange={(value) => setFilters({ ...filters, location: value || '' })}
              />
              <Select
                placeholder="Job type"
                leftSection={<IconBriefcase size={16} />}
                data={['Full-time', 'Part-time', 'Contract', 'Internship']}
                value={filters.type}
                onChange={(value) => setFilters({ ...filters, type: value || '' })}
              />
              <Box>
                <Text size="sm" mb={8}>
                  Salary Per Month: ₹{filters.salaryRange[0]}k - ₹{filters.salaryRange[1]}k 
                  (₹{convertMonthlyKToLPA(filters.salaryRange[0]).toFixed(1)} - ₹{convertMonthlyKToLPA(filters.salaryRange[1]).toFixed(1)} LPA)
                </Text>
                <RangeSlider
                  value={filters.salaryRange}
                  onChange={(value) => setFilters({ ...filters, salaryRange: value })}
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
            {filteredJobs && filteredJobs.map((job) => (
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
                          objectFit: 'contain'
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
                      <Text fw={600} size="lg" mb={4}>{job.title}</Text>
                      <div className="job-details">
                        <IconClock size={14} />
                        <Text size="sm">1-3 yr Exp</Text>
                        <IconBuilding size={14} />
                        <Text size="sm">{job.remote ? 'Onsite': 'Remote' }</Text>
                        <IconMoneybag size={14} />
                        <Text size="sm">₹{job.salaryTo || '0'} LPA</Text>
                      </div>
                      
                     <ul className="job-description" style={{ listStyleType: 'disc', paddingLeft: '1.2rem' }}>
  {job.description.split('\n').map((line, index) => (
    line.trim() !== '' && <li key={index}>{line}</li>
  ))}
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
                    { value: 'Contract', label: 'Contract' }
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
</Flex>              <Textarea
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
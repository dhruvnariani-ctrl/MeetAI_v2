import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

export const COLORS = {
  navy: '#123A59',
  blue: '#0967B2',
  blueDark: '#07518D',
  muted: '#6D8297',
  border: '#DFE8F0',
  background: '#F4F8FC',
  green: '#16815B',
}

export const PAGE_LINKS = [
  {
    label: 'Dashboard',
    description: 'Your daily overview',
    path: '/',
    icon: DashboardOutlinedIcon,
    color: '#0967B2',
    bg: '#EAF3FC',
    tour: 'dashboard',
  },
  {
    label: 'Calendar',
    description: 'View & manage meetings',
    path: '/calendar',
    icon: CalendarMonthOutlinedIcon,
    color: '#16815B',
    bg: '#E8F5EF',
    tour: 'calendar',
  },
  {
    label: 'Recorded Meetings',
    description: 'Transcripts & recordings',
    path: '/recorded',
    icon: DescriptionOutlinedIcon,
    color: '#7556A8',
    bg: '#F1EDFA',
    tour: 'recorded',
  },
  {
    label: 'My Tasks',
    description: 'Track action items',
    path: '/tasks',
    icon: AssignmentTurnedInOutlinedIcon,
    color: '#B56B20',
    bg: '#FFF3E5',
    tour: 'tasks',
  },
]

export const LEARNING_STEPS = [
  {
    title: 'Explore your Dashboard',
    description: 'See today’s meetings, people and tasks.',
    icon: DashboardOutlinedIcon,
    color: '#0967B2',
    bg: '#EAF3FC',
    tour: 'dashboard',
  },
  {
    title: 'Use the Calendar',
    description: 'View your schedule, add new meetings and join instantly.',
    icon: CalendarMonthOutlinedIcon,
    color: '#16815B',
    bg: '#E8F5EF',
    tour: 'calendar',
  },
  {
    title: 'Check Recorded Meetings',
    description: 'Access transcripts, MoM and recordings.',
    icon: DescriptionOutlinedIcon,
    color: '#7556A8',
    bg: '#F1EDFA',
    tour: 'recorded',
  },
  {
    title: 'Manage My Tasks',
    description: 'Track action items and stay on top of commitments.',
    icon: AssignmentTurnedInOutlinedIcon,
    color: '#16815B',
    bg: '#E8F5EF',
    tour: 'tasks',
  },
  {
    title: 'Enable MeetAI',
    description: 'Get AI assistance, record meetings and summaries.',
    icon: SmartToyOutlinedIcon,
    color: '#0967B2',
    bg: '#EAF3FC',
    tour: 'meetai',
  },
]
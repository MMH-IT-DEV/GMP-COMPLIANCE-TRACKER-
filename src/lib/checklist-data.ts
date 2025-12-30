export interface Requirement {
    id: string;
    title: string;
    subtitle: string;
    priority: 'high' | 'medium' | 'low';
    regulatoryQuote: string;
    source: string;
    sourceUrl: string;
    compliantExample: string;
    nonCompliantExample: string;
    evidenceNeeded: string[];
}

export interface Checklist {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirements: Requirement[];
}

export const checklists: Checklist[] = [
    {
        id: 'it-infrastructure',
        name: 'IT Infrastructure',
        description: 'User accounts, passwords, system inventory, audit trails',
        icon: '🖥️',
        requirements: [
            {
                id: 'unique-user-ids',
                title: 'Unique User IDs',
                subtitle: 'Individual login accounts for all system users',
                priority: 'high',
                regulatoryQuote: '"Each user should have an individual user ID and password that is not shared with other users."',
                source: 'GUI-0050 §4.12',
                sourceUrl: 'https://...',
                compliantExample: 'Each staff member has personal login: diana@mmh.com, robin@mmh.com',
                nonCompliantExample: 'Shared "admin" or "warehouse" accounts',
                evidenceNeeded: [
                    'List of user accounts from each system',
                    'Screenshot showing no shared/generic accounts',
                ],
            },
            {
                id: 'password-policies',
                title: 'Password Policies',
                subtitle: 'Minimum requirements for strong passwords',
                priority: 'high',
                regulatoryQuote: '"Passwords should be changed at regular intervals and have a minimum complexity."',
                source: 'GUI-0050 §4.12',
                sourceUrl: 'https://...',
                compliantExample: 'Passwords must be 12+ chars, changed every 90 days',
                nonCompliantExample: 'No password policy, passwords never expire',
                evidenceNeeded: [
                    'Screenshot of password policy settings',
                    'SOP document for password management',
                ],
            },
        ],
    },
    {
        id: 'backup-recovery',
        name: 'Backup & Recovery',
        description: 'Data backups, disaster recovery, restoration tests',
        icon: '💾',
        requirements: [
            {
                id: 'regular-backups',
                title: 'Regular Backups',
                subtitle: 'Automated daily backups of all critical systems',
                priority: 'high',
                regulatoryQuote: '"Data should be backed up regularly and stored in a secure location."',
                source: 'GUI-0050 §5.2',
                sourceUrl: 'https://...',
                compliantExample: 'Daily automated backups to AWS S3 with versioning',
                nonCompliantExample: 'Manual backups triggered occasionally',
                evidenceNeeded: [
                    'Backup configuration logs',
                    'Proof of off-site storage',
                ],
            },
            {
                id: 'restoration-testing',
                title: 'Restoration Testing',
                subtitle: 'Periodic testing of data restoration procedures',
                priority: 'medium',
                regulatoryQuote: '"Procedures should be tested to ensure that data can be restored."',
                source: 'GUI-0050 §5.3',
                sourceUrl: 'https://...',
                compliantExample: 'Quarterly restoration tests logged and verified',
                nonCompliantExample: 'No restoration tests performed since setup',
                evidenceNeeded: [
                    'Restoration test logs',
                    'Disaster recovery plan document',
                ],
            },
        ],
    },
    {
        id: 'electronic-records',
        name: 'Electronic Records & Signatures',
        description: 'Audit trails, e-signatures compliance, record retention',
        icon: '📝',
        requirements: [
            {
                id: 'audit-trails',
                title: 'Audit Trails',
                subtitle: 'Track all changes to critical records',
                priority: 'high',
                regulatoryQuote: '"Computer systems should produce accurate and complete copies of records..."',
                source: 'GUI-0050 §4.10',
                sourceUrl: 'https://...',
                compliantExample: 'Every record change logs user, timestamp, old value, and new value',
                nonCompliantExample: 'Records can be deleted or edited without a trace',
                evidenceNeeded: [
                    'System audit trail report sample',
                    'Technical documentation showing audit trail implementation',
                ],
            },
        ],
    },
    {
        id: 'customer-data',
        name: 'Customer Data Safety',
        description: 'Encryption, access control, privacy documentation',
        icon: '🔒',
        requirements: [
            {
                id: 'data-encryption',
                title: 'Data Encryption',
                subtitle: 'Encryption of sensitive data at rest and in transit',
                priority: 'high',
                regulatoryQuote: '"Sensitive personal information must be protected through encryption..."',
                source: 'Privacy Act / GUI-0050',
                sourceUrl: 'https://...',
                compliantExample: 'AES-256 for storage, TLS 1.3 for transit',
                nonCompliantExample: 'Storing credit card info in plain text',
                evidenceNeeded: [
                    'Technical report on encryption standards used',
                    'SSL certificate verification',
                ],
            },
        ],
    },
    {
        id: 'data-integrity',
        name: 'Data Integrity & Record Keeping',
        description: 'ALCOA principles, document control, archivals',
        icon: '✅',
        requirements: [
            {
                id: 'alcoa-principles',
                title: 'ALCOA Principles',
                subtitle: 'Attributable, Legible, Contemporaneous, Original, Accurate',
                priority: 'high',
                regulatoryQuote: '"Records should be attributable, legible, contemporaneous, original, and accurate."',
                source: 'PIC/S Data Integrity Guidance',
                sourceUrl: 'https://...',
                compliantExample: 'All digital records follow ALCOA+ framework',
                nonCompliantExample: 'Incomplete records or back-dated entries',
                evidenceNeeded: [
                    'Data integrity SOP',
                    'Staff training records on ALCOA',
                ],
            },
        ],
    },
];

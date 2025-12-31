export interface Requirement {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    regulatoryQuote: string;
    source: string;
    sourceUrl: string;
    compliantExample?: string;
    nonCompliantExample?: string;
    evidenceNeeded: string[];
    tables?: {
        title: string;
        headers: string[];
        rows: string[][];
    }[];
}

export interface ChecklistSection {
    title: string;
    color: string;
    requirements: Requirement[];
}

export interface Checklist {
    id: string;
    name: string;
    description: string;
    icon: string;
    sections: ChecklistSection[];
}

export const checklists: Checklist[] = [
    {
        id: 'it-infrastructure',
        name: 'IT Infrastructure Checklist',
        description: 'User accounts, passwords, system inventory, audit trails',
        icon: '🖥️',
        sections: [
            {
                title: 'CRITICAL — MUST HAVE BEFORE INSPECTION',
                color: 'error',
                requirements: [
                    {
                        id: 'user-accounts',
                        title: 'Individual User Accounts',
                        subtitle: 'No shared logins for GMP systems',
                        description: 'Every person who accesses systems containing GMP data (batch records, inventory, specifications) must have their own unique username and password. No sharing login credentials between employees.',
                        priority: 'high',
                        regulatoryQuote: '"Suitable methods of preventing unauthorized entry to the system may include the use of keys, pass cards, personal codes with passwords, biometrics, restricted access to computer equipment..."',
                        source: 'GUI-0050 A 4.12',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.12',
                        tables: [
                            {
                                title: 'Common Violations',
                                headers: ['Non-Compliant', 'Compliant'],
                                rows: [
                                    ['Shared "production" or "admin" account', 'Each person has unique login'],
                                    ['No password required for Windows login', 'Password required for all systems'],
                                    ['Software doesn\'t require user login', 'Individual authentication required']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Proof everyone has their own login — screenshot/export the user list showing individual names',
                            'No shared passwords — A simple written statement that employees are not allowed to share credentials'
                        ],
                    },
                    {
                        id: 'system-inventory',
                        title: 'System Inventory',
                        subtitle: 'Master list of all computerized systems',
                        description: 'A documented list of every computerized system used in GMP activities — software, databases, cloud services. Inspectors typically ask to see this first.',
                        priority: 'high',
                        regulatoryQuote: '"An up-to-date listing of all relevant systems and their GMP functionality (inventory) should be available."',
                        source: 'GUI-0050 A 4.4',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.4',
                        tables: [
                            {
                                title: 'Required Information Per System',
                                headers: ['Field', 'Description'],
                                rows: [
                                    ['System Name', 'Name of software/system'],
                                    ['Location', 'Cloud, local server, workstation'],
                                    ['GMP Function', 'What GMP activity does it support?'],
                                    ['Criticality', 'Direct GMP impact / Indirect / None'],
                                    ['Validation Status', 'Validated, vendor-validated, N/A'],
                                    ['Vendor', 'Software provider name']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'A list of all your systems — Spreadsheet or document with the information from the table above',
                            'Update when you add or remove systems to keep it current'
                        ],
                    },
                    {
                        id: 'audit-trails',
                        title: 'Audit Trails Enabled',
                        subtitle: 'Automatic logging of who changed what, when',
                        description: 'Systems holding GMP data must automatically record all changes and deletions. The log must capture: who made the change, what was changed (old and new values), when it happened, and ideally why.',
                        priority: 'high',
                        regulatoryQuote: '"Consideration should be given, based on a risk assessment, to building into the system the creation of a record of all GMP-relevant changes and deletions (a system generated \'audit trail\')."',
                        source: 'GUI-0050 A 4.9',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.9',
                        tables: [
                            {
                                title: 'Audit Trail Requirements',
                                headers: ['Requirement', 'Meaning'],
                                rows: [
                                    ['System-generated', 'Created automatically, not manually'],
                                    ['Secure', 'Users cannot disable or modify the log'],
                                    ['Available', 'Can be viewed and exported'],
                                    ['Intelligible', 'Human-readable, not encrypted'],
                                    ['Reviewed', 'Periodically checked for anomalies']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Audit trail is turned on — Screenshot from your system settings showing the feature is enabled',
                            'Sample of what it captures — Export or screenshot showing a change with who/what/when recorded',
                            'Users can\'t turn it off — Show that regular users don\'t have permission to disable logging'
                        ],
                    },
                    {
                        id: 'access-control',
                        title: 'Access Control Records',
                        subtitle: 'Log of who has access and when it was granted/revoked',
                        description: 'You must document when access is granted or removed from systems. Track who approved access, what level they received, and when access was revoked (e.g., when employee leaves).',
                        priority: 'high',
                        regulatoryQuote: '"There should be a defined procedure for the issue, cancellation, and alteration of authorization to enter and amend data, including the changing of personal passwords."',
                        source: 'GUI-0050 A 4.12',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.12',
                        tables: [
                            {
                                title: 'What to Track',
                                headers: ['Field', 'Description'],
                                rows: [
                                    ['Person', 'Name of employee'],
                                    ['System', 'Which system access was granted to'],
                                    ['Access Level', 'Admin, user, read-only, etc.'],
                                    ['Date Granted', 'When access was given'],
                                    ['Approved By', 'Who authorized the access'],
                                    ['Date Revoked', 'When access was removed (if applicable)']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Who has access to what — A simple spreadsheet tracking who can access which systems',
                            'Proof you remove access when people leave — Show that former employees no longer have access'
                        ],
                    },
                    {
                        id: 'change-control',
                        title: 'Change Control SOP + Log',
                        subtitle: 'Documented approval process for system changes',
                        description: 'Before changing any GMP system (software update, configuration change, patch), you must: document the change, assess the impact, get approval, implement, verify, and record completion.',
                        priority: 'high',
                        regulatoryQuote: '"Any changes to a computerized system including system configurations should only be made in a controlled manner in accordance with a defined procedure."',
                        source: 'GUI-0050 A 4.10',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.10',
                        tables: [
                            {
                                title: 'Change Control Process',
                                headers: ['Step', 'Description'],
                                rows: [
                                    ['1. Request', 'Document what change is needed and why'],
                                    ['2. Assess', 'Evaluate impact on GMP (direct/indirect/none)'],
                                    ['3. Approve', 'Get sign-off (QA for GMP-impacting changes)'],
                                    ['4. Implement', 'Make the change'],
                                    ['5. Verify', 'Confirm change worked as expected'],
                                    ['6. Close', 'Document completion in change log']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Written procedure — A short SOP explaining how you approve changes before making them',
                            'Log of changes made — Spreadsheet showing what was changed, when, and who approved it'
                        ],
                    },
                    {
                        id: 'antivirus',
                        title: 'Antivirus/Malware Protection',
                        subtitle: 'Active protection on computers accessing GMP data',
                        description: 'All computers accessing GMP systems must have antivirus/anti-malware software that is installed, running, and up-to-date. Windows Defender is acceptable.',
                        priority: 'high',
                        regulatoryQuote: '"Security patches for operating systems and network components should be applied in a controlled and timely manner according to vendor recommendations in order to maintain data security."',
                        source: 'PIC/S PI 041-1',
                        sourceUrl: 'https://picscheme.org/docview/4590',
                        evidenceNeeded: [
                            'It\'s installed and working — Screenshot showing antivirus is active and definitions are current',
                            'Real-time protection is on — Screenshot showing protection is enabled'
                        ],
                    },
                ]
            },
            {
                title: 'IMPORTANT — SHOULD HAVE SOON',
                color: 'warning',
                requirements: [
                    {
                        id: 'password-policy',
                        title: 'Password Policy',
                        subtitle: 'Documented password requirements',
                        description: 'A written policy specifying password requirements. Inspectors expect industry-standard practices like minimum length, complexity, and lockout after failed attempts.',
                        priority: 'medium',
                        regulatoryQuote: '"There should be a defined procedure for the issue, cancellation, and alteration of authorization to enter and amend data, including the changing of personal passwords."',
                        source: 'GUI-0050 A 4.12',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.12',
                        evidenceNeeded: [
                            'Written policy — A document stating your password rules (minimum length, complexity, etc.)',
                            'Proof it\'s enforced — Screenshot from system settings showing password requirements are configured'
                        ],
                    },
                    {
                        id: 'incident-reporting',
                        title: 'Incident Reporting Procedure',
                        subtitle: 'Process for reporting and handling IT problems',
                        description: 'A procedure for reporting IT incidents (system failures, data errors, security breaches). Can be integrated into your existing deviation/CAPA process.',
                        priority: 'medium',
                        regulatoryQuote: '"All incidents, not only system failures and data errors, should be reported and assessed."',
                        source: 'GUI-0050 A 4.13',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.13',
                        evidenceNeeded: [
                            'Procedure for reporting problems — Can be part of your existing deviation/CAPA process',
                            'Log of incidents — Even if empty, shows you have the process in place'
                        ],
                    },
                    {
                        id: 'periodic-review',
                        title: 'Periodic Review Schedule',
                        subtitle: 'Regular evaluation of systems for continued compliance',
                        description: 'Periodically review each GMP system to confirm it still works correctly and remains compliant. Frequency based on risk: high-risk annually, lower-risk less frequently.',
                        priority: 'medium',
                        regulatoryQuote: '"Computerized systems should be periodically evaluated to confirm that they remain in a valid state and are GMP compliant."',
                        source: 'GUI-0050 A 4.11',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.11',
                        evidenceNeeded: [
                            'Review schedule — List showing when each system will be reviewed (e.g., annually)',
                            'Completed reviews — Checklist or form showing you actually did the review'
                        ],
                    },
                    {
                        id: 'vendor-agreements',
                        title: 'Vendor/Third-Party Agreements',
                        subtitle: 'Written agreements with IT service providers',
                        description: 'For cloud services or third parties that manage GMP systems, you need documentation of their responsibilities and security controls (TOS, SOC 2, ISO 27001).',
                        priority: 'medium',
                        regulatoryQuote: '"When third parties are used to provide, install, configure, integrate, validate, maintain, modify or retain a computerized system... formal agreements should exist between the parties."',
                        source: 'GUI-0050 A 4.3',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.3',
                        evidenceNeeded: [
                            'Agreements with cloud providers — Copy of Terms of Service or Data Processing Agreement',
                            'Security certifications — If vendor has SOC 2 or ISO 27001, save a copy'
                        ],
                    },
                    {
                        id: 'physical-security',
                        title: 'Physical Security Controls',
                        subtitle: 'Restricted access to computer equipment',
                        description: 'Computers and servers holding GMP data should have physical access controls — locked rooms, secured areas, computers that lock when unattended.',
                        priority: 'medium',
                        regulatoryQuote: '"Physical and/or logical controls should be in place to restrict access to computerized system to authorised persons."',
                        source: 'GUI-0050 A 4.12',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.12',
                        evidenceNeeded: [
                            'Computers are in a secure area — Describe how access is controlled (locked office, etc.)',
                            'Screens lock automatically — Show computers are set to lock after inactivity'
                        ],
                    },
                    {
                        id: 'training-records',
                        title: 'IT Personnel Training Records',
                        subtitle: 'Documentation that IT staff understand GMP requirements',
                        description: 'Anyone managing GMP-critical systems needs documented training on GMP principles, data integrity, and the specific IT procedures they perform.',
                        priority: 'medium',
                        regulatoryQuote: '"All personnel should have appropriate qualifications, level of access and defined responsibilities to carry out their assigned duties."',
                        source: 'GUI-0050 A 4.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.2',
                        evidenceNeeded: [
                            'Training records — Show that IT staff have been trained on relevant procedures',
                            'GMP awareness — Evidence of basic GMP and data integrity training'
                        ],
                    },
                ]
            }
        ],
    },
    {
        id: 'backup-recovery',
        name: 'Backup & Data Recovery Checklist',
        description: 'Data backups, disaster recovery, restoration tests',
        icon: '💾',
        sections: [
            {
                title: 'CRITICAL — MUST HAVE BEFORE INSPECTION',
                color: 'error',
                requirements: [
                    {
                        id: 'backup-sop',
                        title: 'Documented Backup Procedure',
                        subtitle: 'Written SOP for what, when, where backups happen',
                        description: 'A short document listing which systems are backed up, how often, and where the copies are stored.',
                        priority: 'high',
                        regulatoryQuote: '"Regular backups of all relevant data should be done."',
                        source: 'GUI-0050 A 4.7.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.7',
                        tables: [
                            {
                                title: 'What Your SOP Should Cover',
                                headers: ['Section', 'Example'],
                                rows: [
                                    ['Systems covered', 'Katana, QuickBooks, Google Drive'],
                                    ['Frequency', 'Daily / Weekly / Real-time sync'],
                                    ['Backup location', 'Google Drive, Secured external storage'],
                                    ['Responsibility', 'IT Manager or Owner name']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Backup SOP — 1-2 page document with the info above',
                            'Approval signature from Quality or Management'
                        ],
                    },
                    {
                        id: 'backup-evidence',
                        title: 'Proof Backups Are Running',
                        subtitle: 'Logs or records showing backups actually happen',
                        description: 'Having a backup SOP is not enough. You need proof that backups are actually running systematically.',
                        priority: 'high',
                        regulatoryQuote: '"The backup process should be verified to be working correctly at periodic intervals."',
                        source: 'GUI-0050 A 4.7.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.7',
                        tables: [
                            {
                                title: 'Backup Evidence',
                                headers: ['Good Evidence', 'Not Enough'],
                                rows: [
                                    ['Screenshot of software showing dates', '"We do backups" with no proof'],
                                    ['Google Drive version history', 'Software installed but never checked'],
                                    ['Email notifications from service', 'Empty log template'],
                                    ['Manual log with dates + initials', 'Scheduled task never verified']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Backup logs — Screenshots or exports showing recent successful backups',
                            'Manual log — Spreadsheet with date, system, result, and initials'
                        ],
                    },
                    {
                        id: 'separate-storage',
                        title: 'Separate Storage Location',
                        subtitle: 'Backups stored away from production systems',
                        description: 'If a fire or theft affects your facility, your backups should survive. Store them at a separate and secure location.',
                        priority: 'high',
                        regulatoryQuote: '"Backup data should be stored at a separate and secure location."',
                        source: 'GUI-0050 A 4.7.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.7',
                        tables: [
                            {
                                title: 'Acceptable Locations',
                                headers: ['Compliant', 'Non-Compliant'],
                                rows: [
                                    ['Cloud storage (Google Drive, AWS)', 'External hard drive in same room'],
                                    ['Different building location', 'USB drive in desk drawer'],
                                    ['Owner\'s secured home', 'Same server as production'],
                                    ['Bank safety deposit box', 'Same computer, different folder']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Document where backups go — Cloud service name or physical address',
                            'Security measures — Encryption, locked storage, access controls'
                        ],
                    },
                ]
            },
            {
                title: 'IMPORTANT — SHOULD HAVE SOON',
                color: 'warning',
                requirements: [
                    {
                        id: 'restore-testing',
                        title: 'Test That Backups Work',
                        subtitle: 'Periodically restore a backup to verify it\'s usable',
                        description: 'A backup is worthless if you can\'t restore it. Test the restoration process at least once a year.',
                        priority: 'medium',
                        regulatoryQuote: '"The backup process should be verified to be working correctly at periodic intervals."',
                        source: 'GUI-0050 A 4.7.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.7',
                        tables: [
                            {
                                title: 'Recommended Testing Frequency',
                                headers: ['System Type', 'Recommended'],
                                rows: [
                                    ['Critical (batch records)', 'Quarterly'],
                                    ['Business systems', 'Every 6 months'],
                                    ['Supporting systems', 'Annually']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Test record — Date, system tested, backup date used, result (pass/fail)',
                            'Verification — Confirm data was complete and readable after restoration'
                        ],
                    },
                    {
                        id: 'retention',
                        title: 'Keep Backups Long Enough',
                        subtitle: 'Retain backups for required time periods',
                        description: 'GMP records must be kept for specific periods. Your backups must cover these timeframes (usually 1 year past product expiry).',
                        priority: 'medium',
                        regulatoryQuote: '"Backup data should be stored... for the period of time specified for the type of data."',
                        source: 'GUI-0050 A 4.7.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.7',
                        tables: [
                            {
                                title: 'Minimum Retention',
                                headers: ['Record Type', 'Keep For'],
                                rows: [
                                    ['Batch records, testing, distribution', '1 year past product expiry'],
                                    ['Complaint records', '1 year past product expiry'],
                                    ['Training records', 'Employment + 1 year']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Retention schedule — List of record types and how long to keep',
                            'Proof of old backups — Show you can still access archives within the retention period'
                        ],
                    },
                ]
            },
            {
                title: 'NICE TO HAVE — BEST PRACTICES',
                color: 'blue',
                requirements: [
                    {
                        id: 'recovery-procedures',
                        title: 'Recovery Instructions',
                        subtitle: 'Step-by-step guide to restore from backup',
                        description: 'Written instructions so anyone can restore systems, even if the usual IT person is unavailable.',
                        priority: 'low',
                        regulatoryQuote: '"Provisions should be made to ensure continuity of support for those processes in the event of a system breakdown."',
                        source: 'GUI-0050 A 4.16',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.16',
                        tables: [
                            {
                                title: 'Recovery Guide Content',
                                headers: ['Section', 'Content'],
                                rows: [
                                    ['Where to find backups', 'Cloud login or physical location'],
                                    ['Credentials', 'Reference to secured password manager'],
                                    ['Steps to restore', 'Click-by-click instructions'],
                                    ['Who to call', 'IT support contact info']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Recovery procedure document',
                            'Designated personnel list responsible for recovery'
                        ],
                    },
                    {
                        id: 'rpo-rto',
                        title: 'Recovery Time Targets',
                        subtitle: 'Define acceptable downtime and data loss',
                        description: 'RPO (Recovery Point Objective) = How much data loss is OK. RTO (Recovery Time Objective) = How fast must you recover.',
                        priority: 'low',
                        regulatoryQuote: '"The time required to bring the alternative arrangements into use should be based on risk."',
                        source: 'GUI-0050 A 4.16',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.16',
                        tables: [
                            {
                                title: 'Example Targets',
                                headers: ['System', 'RPO (Data Loss)', 'RTO (Downtime)'],
                                rows: [
                                    ['Batch records (Katana)', '24 hours', '48 hours'],
                                    ['Orders (Shopify)', 'Real-time', '4 hours'],
                                    ['Accounting (QuickBooks)', '24 hours', '72 hours']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'RPO/RTO table for your systems',
                            'Justification for why these times are acceptable for the business'
                        ],
                    },
                ]
            }
        ],
    },
    {
        id: 'electronic-records',
        name: 'Electronic Records & Signatures Checklist',
        description: 'Signatures compliance, record retention, and printability',
        icon: '📝',
        sections: [
            {
                title: 'CRITICAL — MUST HAVE BEFORE INSPECTION',
                color: 'error',
                requirements: [
                    {
                        id: 'e-records-sop',
                        title: 'Electronic Records SOP',
                        subtitle: 'Written procedure for how you handle electronic data',
                        description: 'A short document explaining how your company manages electronic GMP records.',
                        priority: 'high',
                        regulatoryQuote: '"When electronic systems are used to record data, there should be written procedures for the operation and maintenance of the system."',
                        source: 'GUI-0158 Sections 53-58',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'What Your SOP Should Cover',
                                headers: ['Section', 'Content'],
                                rows: [
                                    ['Scope', 'Which systems: Katana, Shopify, QuickBooks, Google Drive'],
                                    ['Data Entry', 'Who can enter/modify GMP data'],
                                    ['Signatures', 'How electronic approvals work'],
                                    ['Printing', 'How to export/print records when needed'],
                                    ['Versions', 'How to manage document versions']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Electronic Records SOP — 1-2 page procedure document',
                            'Approval signature — Signed by Quality or Management'
                        ],
                    },
                    {
                        id: 'records-printable',
                        title: 'Records Can Be Printed',
                        subtitle: 'You can export or print any GMP record when asked',
                        description: 'Inspectors may ask to see a printed copy of any record. You need to be able to export or print from each system.',
                        priority: 'high',
                        regulatoryQuote: '"Electronic records should be protected by being reliable, accessible and stored appropriately such that they can be printed when required."',
                        source: 'GUI-0158 Sections 53-58',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'How to Print From Each System',
                                headers: ['System', 'How to Export/Print'],
                                rows: [
                                    ['Katana', 'Export to CSV or PDF from each module'],
                                    ['Shopify', 'Print order or export to CSV'],
                                    ['QuickBooks', 'Print or export any report'],
                                    ['Google Docs', 'File → Print or Download as PDF']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Test it works — Try exporting one record from each system',
                            'Document the process — Include in your Electronic Records SOP'
                        ],
                    },
                ]
            },
            {
                title: 'IMPORTANT — SHOULD HAVE SOON',
                color: 'warning',
                requirements: [
                    {
                        id: 'e-signature',
                        title: 'Electronic Signature Validation',
                        subtitle: 'Document how your systems confirm who approved what',
                        description: 'An "electronic signature" is proof that a specific person approved something. Logging in and clicking "Approve" counts — no fancy digital signatures needed.',
                        priority: 'medium',
                        regulatoryQuote: '"Electronic signature systems should be tested for their security and ability to confirm that the signature is valid and reliable."',
                        source: 'GUI-0158 Sections 53-58',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'What Counts as Electronic Signature',
                                headers: ['✓ Valid', '✗ Not Valid'],
                                rows: [
                                    ['Login + click "Complete" in Katana', 'Someone else using your login'],
                                    ['Typing name while logged in', 'Typing someone else\'s name'],
                                    ['Email approval from your account', 'Verbal approval with no record'],
                                    ['Google Doc edit with your account', 'Shared account edit']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Document how it works — Explain in SOP that login + action = signature',
                            'Show an example — Screenshot of approval with user ID and timestamp'
                        ],
                    },
                    {
                        id: 'version-control',
                        title: 'Version Control',
                        subtitle: 'Prevent use of outdated documents',
                        description: 'When documents are updated, people should only use the current version. Old versions should be archived, not deleted.',
                        priority: 'medium',
                        regulatoryQuote: '"Version controls should be used, where necessary, to prevent use of outdated documents."',
                        source: 'GUI-0158 Sections 53-58',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Ways to Manage Versions',
                                headers: ['Method', 'How It Works'],
                                rows: [
                                    ['Google Docs', 'Version history automatic — old versions saved'],
                                    ['File naming', 'SOP-001-v2.0_Effective-2024-01-15.docx'],
                                    ['Master document list', 'Spreadsheet tracking current version of each doc'],
                                    ['Archive folder', 'Move old versions to "Archive" folder']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Version control method — Explain how you manage document versions',
                            'Current document list — Show which version is current'
                        ],
                    },
                ]
            },
            {
                title: 'NICE TO HAVE — BEST PRACTICES',
                color: 'blue',
                requirements: [
                    {
                        id: 'change-reasons',
                        title: 'Reason for Changes',
                        subtitle: 'Document why data was changed or deleted',
                        description: 'When GMP data is changed, there should be a reason recorded. Add a comment or note explaining why.',
                        priority: 'low',
                        regulatoryQuote: '"For change or deletion of GMP-relevant data the reason should be documented."',
                        source: 'GUI-0050 A 4.9',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.9',
                        tables: [
                            {
                                title: 'How to Document Reasons',
                                headers: ['System', 'How to Add Reason'],
                                rows: [
                                    ['Katana', 'Add note/comment when editing'],
                                    ['Google Sheets', 'Add comment to edited cell'],
                                    ['Any system', 'Keep a change log spreadsheet']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Train staff — Remind team to add reasons when editing',
                            'Show examples — Records with change reasons documented'
                        ],
                    },
                    {
                        id: 'audit-reviews',
                        title: 'Audit Trail Reviews',
                        subtitle: 'Periodically check audit logs for problems',
                        description: 'Someone should periodically review audit trails to catch unauthorized changes or errors.',
                        priority: 'low',
                        regulatoryQuote: '"Audit trails need to be available and convertible to a generally intelligible form and regularly reviewed."',
                        source: 'GUI-0050 A 4.9',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.9',
                        tables: [
                            {
                                title: 'How Often to Review',
                                headers: ['System', 'Suggested Frequency'],
                                rows: [
                                    ['Batch records (Katana)', 'Quarterly'],
                                    ['Financial (QuickBooks)', 'Quarterly'],
                                    ['Other GMP systems', 'Annually']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Review schedule — Calendar reminder or SOP stating frequency',
                            'Review records — Brief notes showing reviews were done'
                        ],
                    },
                ]
            }
        ],
    },
    {
        id: 'customer-data',
        name: 'Customer Data Safety Checklist',
        description: 'Complaints, distribution records, and adverse reactions',
        icon: '🔒',
        sections: [
            {
                title: 'CRITICAL — MUST HAVE BEFORE INSPECTION',
                color: 'error',
                requirements: [
                    {
                        id: 'complaint-records',
                        title: 'Complaint Records Complete',
                        subtitle: 'All complaints recorded with customer and product info',
                        description: 'Every customer complaint must be recorded with enough detail to investigate.',
                        priority: 'high',
                        regulatoryQuote: '"Written records of all complaints should be retained."',
                        source: 'GUI-0158 Section 51',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/section-51.html',
                        tables: [
                            {
                                title: 'Required Fields',
                                headers: ['Field', 'Example'],
                                rows: [
                                    ['Date received', '2024-12-15'],
                                    ['Customer name + contact', 'Jane Smith, jane@email.com'],
                                    ['Product name + lot', 'Universal Flare Care 2oz, Lot 2024-089'],
                                    ['Complaint description', 'Product arrived damaged'],
                                    ['Investigation + outcome', 'Shipping damage, replacement sent']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Complaint log — All complaints with required fields',
                            'Investigation records — Evidence complaints were investigated'
                        ],
                    },
                    {
                        id: 'distribution-records',
                        title: 'Distribution Records Enable Recall',
                        subtitle: 'Sales records include all info needed to trace products',
                        description: 'If you discover a problem with a batch (contamination, wrong ingredient, labeling error), you must be able to contact every customer who received that batch within 24-48 hours.',
                        priority: 'high',
                        regulatoryQuote: '"Distribution records should contain sufficient information to enable the recall of any lot."',
                        source: 'GUI-0158 Section 53(h)',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Required Fields (Per GUI-0158 A 6.7)',
                                headers: ['Field', 'Where You Have It', 'Status'],
                                rows: [
                                    ['Product name', 'Shopify order line item', '✓ Already tracked'],
                                    ['Lot/Batch number', 'Katana MO → must link to Shopify', '⚠ Check if linked'],
                                    ['Quantity sold', 'Shopify order', '✓ Already tracked'],
                                    ['Date of sale', 'Shopify order date', '✓ Already tracked'],
                                    ['Customer name', 'Shopify customer', '✓ Already tracked'],
                                    ['Customer address', 'Shopify shipping address', '✓ Already tracked']
                                ]
                            },
                            {
                                title: 'Can You Do a Recall?',
                                headers: ['✓ Ready', '✗ Not Ready'],
                                rows: [
                                    ['Can identify orders by lot/batch', 'No idea which batch went to which customer'],
                                    ['Customer email on every order', 'Many guest checkouts with no email'],
                                    ['Can export customer list in minutes', 'Would take days to manually compile'],
                                    ['Have done a mock recall drill', 'Never tested the process']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Distribution record sample — Export showing all required fields',
                            'Lot traceability method — How you link batches to orders',
                            'Mock recall record — Evidence you tested the process'
                        ],
                    },
                ]
            },
            {
                title: 'IMPORTANT — SHOULD HAVE SOON',
                color: 'warning',
                requirements: [
                    {
                        id: 'adverse-reactions',
                        title: 'Adverse Reaction Process',
                        subtitle: 'Procedure to record and report health reactions',
                        description: 'If a customer reports a health problem from your product, record it and possibly report to Health Canada.',
                        priority: 'medium',
                        regulatoryQuote: '"All adverse reactions to NHPs should be recorded and evaluated."',
                        source: 'GUI-0158 Section 52',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a52',
                        tables: [
                            {
                                title: 'When to Report to Health Canada',
                                headers: ['Type', 'Action'],
                                rows: [
                                    ['Serious (hospitalization, death)', 'Report within 15 days via Canada Vigilance'],
                                    ['Non-serious', 'Record internally']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Adverse reaction SOP — How you handle reports',
                            'Adverse reaction log — Records of any reports'
                        ],
                    },
                    {
                        id: 'data-protection',
                        title: 'Customer Data Protected',
                        subtitle: 'Records with personal info stored securely',
                        description: 'Customer info in complaints, orders, and adverse reactions should be protected from unauthorized access.',
                        priority: 'medium',
                        regulatoryQuote: '',
                        source: 'GUI-0158 Sections 53-58',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Protection Checklist',
                                headers: ['✓ Protected', '✗ Not Protected'],
                                rows: [
                                    ['Shopify (HTTPS, encrypted)', 'Customer list in unprotected Excel'],
                                    ['Google Drive (access controlled)', 'Records shared publicly'],
                                    ['Katana (login required)', 'Paper in unlocked cabinet']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Systems use HTTPS — Shopify, Katana, Google do this',
                            'Access controlled — Only authorized staff see data'
                        ],
                    },
                ]
            },
            {
                title: 'NICE TO HAVE — BEST PRACTICES',
                color: 'blue',
                requirements: [
                    {
                        id: 'staff-training',
                        title: 'Staff Trained on Data Handling',
                        subtitle: 'Team knows how to handle customer info',
                        description: 'Staff handling complaints or orders should know: don\'t share customer info, record complaints properly, escalate adverse reactions.',
                        priority: 'low',
                        regulatoryQuote: '',
                        source: 'GUI-0050 §4.2',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.2',
                        tables: [
                            {
                                title: 'Training Topics',
                                headers: ['Topic', 'Key Points'],
                                rows: [
                                    ['Complaint handling', 'Record all details, investigate'],
                                    ['Adverse reactions', 'Recognize serious ones, escalate'],
                                    ['Data privacy', 'Don\'t share outside company'],
                                    ['Recall process', 'Know what records to pull']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Training records — Sign-off that staff were trained',
                            'Quick reference — One-pager for handling complaints'
                        ],
                    },
                ]
            }
        ],
    },
    {
        id: 'data-integrity',
        name: 'Data Integrity & Record Keeping Checklist',
        description: 'Contemporaneous recording, corrections, and legibility',
        icon: '✅',
        sections: [
            {
                title: 'CRITICAL — MUST HAVE BEFORE INSPECTION',
                color: 'error',
                requirements: [
                    {
                        id: 'contemporaneous',
                        title: 'Records Made at Time of Action',
                        subtitle: 'Data recorded when it happens, not later from memory',
                        description: 'Record data as you do the work. Don\'t fill in batch records at the end of the day or next morning from memory.',
                        priority: 'high',
                        regulatoryQuote: '"Records should be made at the time each action is taken."',
                        source: 'GUI-0158 Sections 53-58 (GDP)',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Examples',
                                headers: ['✓ Contemporaneous', '✗ Not Contemporaneous'],
                                rows: [
                                    ['Weigh ingredient → record weight immediately', 'Weigh all ingredients → record at end of day'],
                                    ['Timestamps throughout the day', 'All entries timestamped 5:00pm'],
                                    ['Digital system auto-timestamps entries', 'Paper record completed next morning'],
                                    ['Enter Katana data during production', 'Update Katana at end of week']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Batch records with timestamps — Times spread throughout production',
                            'Training record — Staff trained to record in real-time'
                        ],
                    },
                    {
                        id: 'corrections',
                        title: 'Corrections Done Properly',
                        subtitle: 'Errors crossed out (not erased), initialed, and dated',
                        description: 'When you make a mistake, draw a single line through it so the original is still readable. Add your initials, date, and the correct value.',
                        priority: 'high',
                        regulatoryQuote: '"Any alteration made to records should be signed or initialed and dated; the alteration should permit the reading of the original information."',
                        source: 'GUI-0158 Sections 53-58 (GDP)',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Examples',
                                headers: ['✓ Proper Correction', '✗ Improper Correction'],
                                rows: [
                                    ['Single line, original readable', 'White-out or correction tape'],
                                    ['Initials next to change', 'No indication who changed it'],
                                    ['Date of correction noted', 'No date on correction'],
                                    ['Reason noted if significant', 'Scribbled over, can\'t read original']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Sample corrected record — Shows proper correction method',
                            'Training record — Staff trained on correction procedure',
                            'SOP reference — Document correction procedure in an SOP'
                        ],
                    },
                ]
            },
            {
                title: 'IMPORTANT — SHOULD HAVE SOON',
                color: 'warning',
                requirements: [
                    {
                        id: 'legible',
                        title: 'Records Legible and Clear',
                        subtitle: 'Anyone can read the records, consistent format',
                        description: 'Records must be readable by anyone, not just the person who wrote them. Use clear handwriting or typed entries.',
                        priority: 'medium',
                        regulatoryQuote: '"Records should be clear, legible, indelible and readily available."',
                        source: 'GUI-0158 Sections 53-58 (GDP)',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Legibility Checklist',
                                headers: ['✓ Legible', '✗ Not Legible'],
                                rows: [
                                    ['Clear handwriting in pen', 'Messy handwriting no one can read'],
                                    ['Typed/digital entries', 'Pencil that fades or smudges'],
                                    ['Consistent date format (YYYY-MM-DD)', 'Mixed formats (12/5/24 vs 5-Dec)'],
                                    ['Units clearly stated (g, mL, kg)', 'Numbers without units']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Sample records — Demonstrate consistent, readable format',
                            'Templates — Standardized forms ensure consistency'
                        ],
                    },
                    {
                        id: 'original-preserved',
                        title: 'Original Data Preserved',
                        subtitle: 'Don\'t delete or overwrite original records',
                        description: 'Original records are the "source of truth." Never delete them — keep originals and make corrections visible.',
                        priority: 'medium',
                        regulatoryQuote: '"For the protection of data, measures should be provided against deliberate or inadvertent data changes."',
                        source: 'GUI-0050 A 4.9',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.9',
                        tables: [
                            {
                                title: 'Examples',
                                headers: ['✓ Original Preserved', '✗ Original Lost'],
                                rows: [
                                    ['Paper original kept, photocopy distributed', 'Original thrown away after copying'],
                                    ['Digital system keeps all versions', 'Old file overwritten with new version'],
                                    ['Corrections show original value', 'Original value erased/deleted'],
                                    ['Scan of signed document archived', 'Only unsigned typed version kept']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Original record storage — Where originals are kept',
                            'Version history — Digital systems retain previous versions'
                        ],
                    },
                    {
                        id: 'verified',
                        title: 'Data Verified for Accuracy',
                        subtitle: 'Someone reviews/approves records before finalizing',
                        description: 'Critical data should be checked by a second person or reviewed before the record is finalized.',
                        priority: 'medium',
                        regulatoryQuote: '"There should be recorded evidence that data has been checked for relevance, correctness, and consistency."',
                        source: 'GUI-0050 A 4.6',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/annex-11-guide-computerized-systems-gui-0050.html#a4.6',
                        tables: [
                            {
                                title: 'Verification Methods',
                                headers: ['Method', 'When to Use'],
                                rows: [
                                    ['Second person verification', 'Critical measurements'],
                                    ['Supervisor review + signature', 'Batch record approval'],
                                    ['Self-review before submission', 'Data entry into digital systems'],
                                    ['System validation checks', 'Automated range checks']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Review signatures — Second signature on critical records',
                            'Approval workflow — Process for batch record review'
                        ],
                    },
                ]
            },
            {
                title: 'NICE TO HAVE — BEST PRACTICES',
                color: 'blue',
                requirements: [
                    {
                        id: 'complete',
                        title: 'Records Complete',
                        subtitle: 'No unexplained blank fields, all required data captured',
                        description: 'Every field in a record should be filled in. If something doesn\'t apply, write "N/A" — don\'t leave it blank.',
                        priority: 'low',
                        regulatoryQuote: '',
                        source: 'GUI-0158 Sections 53-58 (GDP)',
                        sourceUrl: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/guide-natural-health-products-0158/sections-52-62.html#a53',
                        tables: [
                            {
                                title: 'Handling Blank Fields',
                                headers: ['✓ Complete', '✗ Incomplete'],
                                rows: [
                                    ['Field marked "N/A" with initials', 'Empty field with no explanation'],
                                    ['Line drawn through unused rows', 'Blank rows at bottom of form'],
                                    ['"None" written if no deviations', 'Deviation section left empty'],
                                    ['Zero entered if quantity is zero', 'Blank instead of zero']
                                ]
                            }
                        ],
                        evidenceNeeded: [
                            'Complete batch records — No unexplained blanks',
                            'Training — Staff know to mark N/A, not leave blank'
                        ],
                    },
                ]
            }
        ],
    },
];

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { hashPassword } = require('../utils/encryption')
const HomeContent = require('../models/homeModel')
const AboutContent = require('../models/aboutModel')
const ObjectivesContent = require('../models/objectivesModel')
const NewsPageHeader = require('../models/newsHeaderModel')
const NewsPost = require('../models/newsPostModel')
const TeamPage = require('../models/teamPageModel')
const TeamMember = require('../models/teamMemberModel')
const GalleryItem = require('../models/galleryItemModel')
const PartnershipPage = require('../models/partnershipPageModel')
const Partner = require('../models/partnerModel')
const ContactPage = require('../models/contactPageModel')
const User = require('../models/userModel')

const mdPath = path.join(__dirname, '../../company_profile.md')
const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : ''

const vision = 'To be a trusted authority in protecting the health of the people of Liberia and ensuring equitable food trade, leveraging integrated and forward-thinking food regulatory frameworks to lead Africa and engage globally'
const mission = 'To Establish National Principles and Systems to Ensure the Safety and Quality of Food and Feed, including the Implementation of Structures and Mechanisms for Food Safety throughout Liberia'
const values = [
  'Collaboration and Transparency: Foster collaboration and mutual respect among stakeholders and partners.',
  'Integrity: Uphold the integrity of the Food Authority of Liberia as the nation’s competent authority to safeguard consumers while ensuring fairness and trust in food trade.',
  'Fairness: Ensure fairness and equity in serving all stakeholders and constituents of the Food Authority of Liberia'
].join('\n')

const bio = 'The Food Authority of Liberia (FAL) was established under the Food Law of Liberia (2017) as the national competent authority mandated to oversee food and feed safety, quality, across the entire supply chain, with the aim to protect Liberian consumers and ensure fair practices in the production and trade of food and agri-food products.'

const goal1 = 'Transform Liberia’s food regulation into an integrated, forward-looking, and proactive framework that safeguards consumers and supports fair food trade.'
const goal2 = 'Promote Food Safety Practices by Food Producers and Operators in Liberia'
const goal3 = 'Engage with Domestic and International Partners and Stakeholders to Promote Liberia’s Position as a Leading Food and Agrifood Producing Country'
const goal4 = 'Build a science capacity serving stakeholders and the Food Authority of Liberia.'
const goal5 = 'Build a dynamic and professional workforce and enable effective food regulatory operations, supported by strong communication'
const goalsList = [goal1, goal2, goal3, goal4, goal5].join('\n')

const seed = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/falcms'
  await mongoose.connect(mongoUri)

  await Promise.all([
    HomeContent.deleteMany({}),
    AboutContent.deleteMany({}),
    ObjectivesContent.deleteMany({}),
    NewsPageHeader.deleteMany({}),
    NewsPost.deleteMany({}),
    TeamPage.deleteMany({}),
    TeamMember.deleteMany({}),
    GalleryItem.deleteMany({}),
    PartnershipPage.deleteMany({}),
    Partner.deleteMany({}),
    ContactPage.deleteMany({}),
    User.deleteMany({})
  ])

  const home = await HomeContent.create({
    headerTitle: 'Food Authority Liberia (FAL)',
    hero: { title: 'Food Authority of Liberia (FAL)', subtitle: 'Protecting consumers and ensuring fair food trade', images: [] },
    snippets: { about: bio, news: 'Latest news and media', objectives: 'Our strategic goals', gallery: 'Highlights' },
    contactInfo: { address: '', email: '', phone: '' },
    footer: { address: '', email: '', phone: '' }
  })

  const about = await AboutContent.create({
    bio,
    mission,
    vision,
    goals: goalsList,
    images: { bioImage: '', missionImage: '', visionImage: '', goalsImage: '' },
    additionalSections: [
      { title: 'Values', content: values, image: '' },
      { title: 'Drivers of Change: Global', content: 'Climate change, disrupted trade flows, inflationary pressures, and increasing sustainability requirements are reshaping food systems. International markets are demanding higher levels of traceability and compliance while digital tools and science-based approaches create opportunities to modernize food control functions.', image: '' },
      { title: 'Drivers of Change: Regional', content: 'ECOWAS harmonized SPS frameworks and food safety measures require alignment and stronger risk-based oversight mechanisms. The AU’s Africa Food Safety Strategy emphasizes harmonized regulation and institutional capacity.', image: '' },
      { title: 'Drivers of Change: National', content: 'Food security challenges, weak production and handling practices, and fragmented regulatory oversight necessitate a consolidated, science-based authority to coordinate and enforce food safety and quality in Liberia.', image: '' }
    ]
  })

  const objectives = await ObjectivesContent.create({
    intro: 'Strategic Goals 2026–2028',
    objectives: [
      { title: goal1, description: goal1, image: '' },
      { title: goal2, description: goal2, image: '' },
      { title: goal3, description: goal3, image: '' },
      { title: goal4, description: goal4, image: '' },
      { title: goal5, description: goal5, image: '' }
    ],
    sections: []
  })

  const newsHeader = await NewsPageHeader.create({
    title: 'News & Media',
    description: 'Updates and communications from the Food Authority of Liberia',
    image: ''
  })

  const teamPage = await TeamPage.create({ description: 'Build a dynamic and professional workforce and enable effective operations, supported by strong communication', headerImage: '' })

  const partnershipPage = await PartnershipPage.create({ title: 'Partnerships', description: 'Engagement with domestic, regional, and international partners to strengthen Liberia’s food regulatory system', image: '' })

  const partners = await Partner.insertMany([
    { name: 'ECOWAS', image: '', link: '' },
    { name: 'African Union (AU)', image: '', link: '' },
    { name: 'AfCFTA', image: '', link: '' },
    { name: 'Codex Alimentarius Commission', image: '', link: '' }
  ])

  const contactPage = await ContactPage.create({ title: 'Contact Us', description: 'Reach the Food Authority of Liberia', image: '', address: '', email: '', phone: '' })

  const adminUsername = process.env.ADMIN_USERNAME || 'superadmin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const admin = await User.create({ username: adminUsername, password: hashPassword(adminPassword), role: 'superAdmin', isActive: true })

  await mongoose.disconnect()
}

if (require.main === module) {
  seed().then(() => { console.log('Seeding complete') }).catch(err => { console.error(err); process.exitCode = 1 }).finally(() => process.exit())
}

import dbConnect from '@/lib/db';
import Service from '@/lib/models/Service';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';

const DEFAULT_SERVICES = [
  ['Mental Health Assessment & Counselling', 'A confidential assessment and supportive counselling plan tailored to your emotional and mental health needs.', 'Brain'],
  ['Individual & Group Therapy', 'Guided therapy sessions that build insight, coping skills, and connection in an individual or group setting.', 'Users'],
  ['Couples & Family Therapy', 'Structured conversations that help couples and families improve communication, trust, and mutual support.', 'Heart'],
  ['Addiction Assessment & Treatment', 'Professional assessment and recovery support for individuals affected by substance use and related challenges.', 'Shield'],
  ['Rehabilitation & Recovery Support', 'Practical guidance and a supportive environment for building healthy routines and lasting recovery.', 'Lightbulb'],
  ['Aftercare & Relapse Prevention', 'Ongoing follow-up and personalized strategies to maintain progress and manage future challenges.', 'Repeat2'],
  ['Psychological Assessment', 'Careful psychological evaluation to better understand strengths, concerns, and appropriate support options.', 'Microscope'],
  ['Trauma & Grief Counselling', 'Compassionate support for processing loss, trauma, and difficult life experiences at your own pace.', 'Wind'],
  ['Youth & Adolescent Support', 'Age-appropriate support that helps young people navigate emotions, relationships, school, and change.', 'Smile'],
  ['Life Skills & Personal Development', 'Practical tools for confidence, decision-making, communication, independence, and personal growth.', 'BookOpen'],
  ['Corporate Mental Health & Wellness', 'Workplace wellness support that promotes healthier teams, stress management, and a positive work culture.', 'Building2'],
  ['Community Outreach & Training', 'Mental health education and training that helps communities recognize concerns and respond with care.', 'Megaphone'],
].map(([name, description, icon], order) => ({
  name,
  description,
  icon,
  order,
  isActive: true,
}));

export async function GET(req) {
  await dbConnect();

  try {
    if (await Service.countDocuments() === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
    }

    const services = await Service.find({ isActive: true }).sort('order');
    
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    console.error('GET services error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const token = getTokenFromRequest(req);
    const auth = verifyAuth(token);

    if (!auth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { name, description, icon, image, price, duration, order } = await req.json();

    if (!name || !description) {
      return new Response(
        JSON.stringify({ message: 'Name and description are required' }),
        { status: 400 }
      );
    }

    const service = new Service({
      name,
      description,
      icon,
      image,
      price,
      duration,
      order: order || 0,
      isActive: true,
    });

    await service.save();

    return new Response(
      JSON.stringify({
        message: 'Service created successfully',
        service,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST service error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

import electricianImg from './electrician.webp';
import plumberImg from './plumber.webp';
import carpenterImg from './carpenter.webp';
import acApplianceImg from './ac-appliance.webp';
import painterImg from './painter.webp';
import autoMechanicImg from './auto-mechanic.webp';
import industrialElecImg from './industrial-electrician.webp';
import cctvSecurityImg from './cctv-security.webp';
import solarInverterImg from './solar-inverter.webp';
import homeCleaningImg from './home-cleaning.webp';
import welderImg from './welder.webp';
import tilerImg from './tiler.webp';
import defaultCategoryImg from './default-category.webp';

export const CATEGORY_IMAGES = {
  electrician: electricianImg,
  plumber: plumberImg,
  carpenter: carpenterImg,
  acAppliance: acApplianceImg,
  painter: painterImg,
  autoMechanic: autoMechanicImg,
  industrialElec: industrialElecImg,
  cctvSecurity: cctvSecurityImg,
  solarInverter: solarInverterImg,
  homeCleaning: homeCleaningImg,
  welder: welderImg,
  tiler: tilerImg,
  default: defaultCategoryImg,
} as const;

// i18n.js — the single home for every user-facing string on the BPR site.
//
// Task 5 creates this file; tasks 5, 7, 8 and 9 add their keys here and nowhere
// else. A page that hardcodes English prose instead of calling t() is a bug:
// this site is Saudi-first, so a key with no `ar` entry is an incomplete
// translation, not a fallback.
//
// Contract:
//   t(key, lang)            -> string | null
//   t(key, lang, {a: 'x'})  -> string with {a} substituted
//
// `null` is returned for an unknown key. render.js's translate() treats null as
// "leave this node alone", which is the behaviour we want: a missing key must
// never blank text that is already on screen.

import { registerTranslator } from './render.js';

const STRINGS = {
  // ---- Brand + document titles ------------------------------------------
  'brand': { en: 'BrainSAIT Provider Registry', ar: 'سجل مزوّدي BrainSAIT' },

  // ---- Common field labels ----------------------------------------------
  'common.spid': { en: 'SPID', ar: 'معرّف المزوّد' },
  'common.oid': { en: 'OID', ar: 'معرّف OID' },
  'common.buid': { en: 'BUID', ar: 'معرّف BUID' },
  'common.trust': { en: 'Trust level', ar: 'مستوى الثقة' },
  'common.status': { en: 'Status', ar: 'الحالة' },
  'common.state': { en: 'Slot state', ar: 'حالة الشاغر' },
  'common.title': { en: 'Title', ar: 'العنوان' },
  'common.organization': { en: 'Organisation', ar: 'المؤسسة' },
  'common.specialty': { en: 'Specialty', ar: 'التخصّص' },
  'common.slot_type': { en: 'Slot type', ar: 'نوع الشاغر' },
  'common.holder': { en: 'Slot holder', ar: 'حامل الشاغر' },
  'common.unassigned': { en: 'Unassigned', ar: 'غير مُسنَد' },
  'common.integration_fee': { en: 'Integration fee', ar: 'رسوم التكامل' },
  'common.monthly_fee': { en: 'Monthly fee', ar: 'الرسوم الشهرية' },
  'common.sar': { en: 'SAR', ar: 'ريال' },
  'common.not_stated': { en: 'Not stated', ar: 'غير مذكور' },
  'common.state_unknown': { en: 'Unrecognised state', ar: 'حالة غير معروفة' },
  'common.loading': { en: 'Reading the registry…', ar: 'جارٍ قراءة السجل…' },
  'common.not_found': { en: 'Not found', ar: 'غير موجود' },
  'common.all': { en: 'All', ar: 'الكل' },
  'common.view': { en: 'View', ar: 'عرض' },
  'common.yes': { en: 'Yes', ar: 'نعم' },
  'common.no': { en: 'No', ar: 'لا' },

  // ---- Honesty states -----------------------------------------------------
  // These name the adapter's own state, which render.js reports on the banner.
  'state.stale': { en: 'Stale', ar: 'بيانات قديمة' },
  'state.live': { en: 'Live', ar: 'قراءة مباشرة' },
  'state.unverified': { en: 'Unverified', ar: 'غير موثّق' },

  // ---- Consent (R1) ------------------------------------------------------
  // All 9 members currently return identity_withheld. This is the string that
  // stands in for a name; it must never render as blank.
  'consent.pending': { en: 'Consent pending', ar: 'بانتظار الموافقة' },
  'consent.granted': { en: 'Consent granted', ar: 'الموافقة مُمنوحة' },
  'consent.reason': { en: 'Reason given: {reason}', ar: 'السبب المُسجَّل: {reason}' },
  'consent.withheld_notice': {
    en: 'Identity withheld until consent is recorded. Only the SPID is published.',
    ar: 'الهوية مكتومة حتى تُسجَّل الموافقة. لا يُنشر سوى معرّف المزوّد.',
  },

  // ---- Verification claim ceiling ----------------------------------------
  'verify.unverified': { en: 'Unverified', ar: 'غير موثّق' },
  'verify.rung_of': { en: 'Rung {rung} of {max}', ar: 'الدرجة {rung} من {max}' },
  'verify.badge.verified': { en: 'Verified', ar: 'موثّق' },
  'verify.badge.registered': { en: 'Registered', ar: 'مسجّل' },
  'verify.badge.none': { en: 'No badge', ar: 'بلا علامة' },
  'verify.badge_label': { en: 'Badge', ar: 'العلامة' },
  'verify.state': { en: 'Verification state', ar: 'حالة التوثيق' },
  'verify.recorded_at': { en: 'Registered at', ar: 'تاريخ التسجيل' },

  // ---- Slot states (rendered via stateChip, words via this table) ---------
  'slotstate.empty': { en: 'Empty', ar: 'شاغر' },
  'slotstate.requested': { en: 'Requested', ar: 'مطلوب' },
  'slotstate.invoiced': { en: 'Invoiced', ar: 'صدرت الفاتورة' },
  'slotstate.verifying': { en: 'Verifying', ar: 'قيد التحقّق' },
  'slotstate.live': { en: 'Live', ar: 'فعّال' },

  // ---- Screen identities --------------------------------------------------
  'registry.front': { en: 'Registry', ar: 'السجل' },
  'registry.directory': { en: 'Provider directory', ar: 'دليل المزوّدين' },
  'registry.dossier': { en: 'Provider dossier', ar: 'ملف المزوّد' },
  'registry.slots': { en: 'Slot marketplace', ar: 'سوق الشواغر' },
  'registry.chain': { en: 'Trust chain', ar: 'سلسلة الثقة' },
  'registry.delegations': { en: 'Delegation register', ar: 'سجل التفويضات' },
  'registry.tree': { en: 'Sub-slot tree', ar: 'شجرة الشواغر الفرعية' },
  'registry.ladder': { en: 'Trust ladder', ar: 'سُلّم الثقة' },

  // ---- Screen 1 — front page ---------------------------------------------
  'front.headline': {
    en: 'A provider registry that shows what it can prove',
    ar: 'سجل مزوّدين يُظهر ما يمكنه إثباته',
  },
  'front.lede': {
    en: 'Every record below is read live from the registry at the moment this page loads. Where a claim cannot be evidenced, this page says so instead of rounding it up.',
    ar: 'كل سجل هنا يُقرأ مباشرةً من السجل لحظة تحميل الصفحة. وحيث لا يمكن إثبات مُدّعًى، تُظهر الصفحة ذلك صراحةً بدل التقريب.',
  },
  'front.ladder_summary': {
    en: 'Verification ladder: {count} rungs, from {first} to {last}.',
    ar: 'سُلّم التوثيق: {count} درجات، من {first} إلى {last}.',
  },
  'front.ladder_cta': { en: 'See the full ladder', ar: 'اعرض السُلّم كاملًا' },
  'front.link.directory': { en: 'Provider directory', ar: 'دليل المزوّدين' },
  'front.link.slots': { en: 'Slot marketplace', ar: 'سوق الشواغر' },
  'front.link.verify': { en: 'Verify a credential', ar: 'تحقّق من مُدّعًى' },
  'front.link.consent': { en: 'Consent & publication', ar: 'الموافقة والنشر' },

  // ---- Screen 2 — directory ----------------------------------------------
  'directory.lede': {
    en: 'Every registered member is listed by SPID. A name appears only once the subject has acknowledged publication.',
    ar: 'كل مزوّد مسجّل مذكور بمعرّفه. لا يظهر الاسم إلا بعد أن يوافق على النشر.',
  },
  'directory.count': {
    en: '{count} registered member(s)',
    ar: '{count} مزوّد مسجّل',
  },
  'directory.withheld_all': {
    en: 'All {count} names are withheld at this time. The SPID, trust level and verification rung are still readable.',
    ar: 'أسماء {count} مزوّدين مكتومة حاليًا. تبقى المعرّفات ومستويات الثقة ودرجات التوثيق مقروءة.',
  },
  'directory.empty': { en: 'The registry returned no members.', ar: 'لم يُرجع السجل أي مزوّدين.' },
  'directory.open_dossier': { en: 'Open dossier', ar: 'افتح الملف' },

  // ---- Screen 3 — dossier -------------------------------------------------
  'dossier.name': { en: 'Name', ar: 'الاسم' },
  'dossier.headline': { en: 'Practice headline', ar: 'وصف الممارسة' },
  'dossier.services': { en: 'Services', ar: 'الخدمات' },
  'dossier.modes': { en: 'Working modes', ar: 'أوضاع العمل' },
  'dossier.locations': { en: 'Locations', ar: 'المواقع' },
  'dossier.slots_held': { en: 'Slots held', ar: 'الشواغر المحجوزة' },
  'dossier.canonical': { en: 'Canonical identifier', ar: 'المعرّف المرجعي' },
  'dossier.not_found': {
    en: 'The registry holds no member with the identifier {spid}.',
    ar: 'لا يوجد في السجل مزوّد بالمعرّف {spid}.',
  },
  'dossier.no_spid': { en: 'No provider identifier in this URL.', ar: 'لا يوجد معرّف مزوّد في هذا الرابط.' },

  // ---- Screen 12 — slots marketplace -------------------------------------
  'slots.lede': {
    en: 'A slot is a published vacancy with a named price and a named state. The state chip is the only thing that says whether it is open.',
    ar: 'الشاغر هو شاغرة معلنة بسعر محدّد وحالة محدّدة. شارة الحالة وحدها هي التي تقول إن كان مفتوحًا.',
  },
  'slots.count': { en: '{count} slot(s)', ar: '{count} شاغر' },
  'slots.filter.state': { en: 'State', ar: 'الحالة' },
  'slots.filter.type': { en: 'Slot type', ar: 'نوع الشاغر' },
  'slots.filter.specialty': { en: 'Specialty contains', ar: 'تخصّص يحتوي' },
  'slots.filter.specialty_placeholder': { en: 'e.g. emergency', ar: 'مثال: الطوارئ' },
  'slots.filter.reset': { en: 'Clear filters', ar: 'امسح عوامل التصفية' },
  'slots.filtered_count': { en: '{shown} of {total} shown', ar: 'يُعرض {shown} من {total}' },
  'slots.empty': { en: 'No slot matches these filters.', ar: 'لا يوجد شاغر مطابق لعوامل التصفية.' },
  'slots.empty_registry': { en: 'The registry returned no slots.', ar: 'لم يُرجع السجل أي شواغر.' },
  'slots.manifest': { en: 'Published manifest', ar: 'النطاق المنشور' },
  'slots.requirements': { en: 'Stated requirements', ar: 'المتطلبات المُعلنة' },
  'slots.chain_link': { en: 'Trust chain for this slot', ar: 'سلسلة الثقة لهذا الشاغر' },
  'slots.tree_link': { en: 'Sub-slots', ar: 'الشواغر الفرعية' },
  'slots.detail_lede': { en: 'Slot {id}', ar: 'الشاغر {id}' },
  'slots.not_found': {
    en: 'The registry holds no slot with the identifier {id}. Nothing is shown here because nothing was returned.',
    ar: 'لا يوجد في السجل شاغر بالمعرّف {id}. لا يُعرض شيء هنا لأن السجل لم يُرجع أي شاغر.',
  },
  'slots.not_found_hint': {
    en: 'Check the identifier, or return to the marketplace.',
    ar: 'تحقّق من المعرّف، أو عُد إلى السوق.',
  },
  'slots.back': { en: 'Back to the marketplace', ar: 'العودة إلى السوق' },
  'slots.request_link': { en: 'Request this slot', ar: 'اطلب هذا الشاغر' },

  // ---- Screen 14 — trust chain -------------------------------------------
  'chain.doc_title': { en: 'Credential document', ar: 'وثيقة مُدّعًى' },
  'chain.org': { en: 'Issuing organisation', ar: 'المؤسسة المُصدِرة' },
  'chain.holder': { en: 'Slot holder', ar: 'حامل الشاغر' },
  'chain.parent': { en: 'Parent slot', ar: 'الشاغر الأب' },
  'chain.delegation': { en: 'Delegation', ar: 'تفويض' },
  'chain.qr': { en: 'Verification code', ar: 'رمز التحقّق' },
  'chain.qr_hint': {
    en: 'Scan to re-read this chain from the verification host.',
    ar: 'امسح الرمز لإعادة قراءة هذه السلسلة من مُضيف التحقّق.',
  },
  'chain.stamp_signed': { en: 'Signed', ar: 'موقّع' },
  'chain.stamp_unsigned': { en: 'Unsigned', ar: 'غير موقّع' },
  'chain.stamp_note': {
    en: 'The stamp reports whether a consent signature was stored. It is not derived from a signature error, which is also null for a delegation that was never meant to be signed.',
    ar: 'الختم يُظهر ما إذا كانت هناك موافقة موقّعة محفوظة. وهو ليس مشتقًا من خطأ التوقيع، الذي يكون فارغًا أيضًا في تفويض لم يُقصد توقيعه.',
  },
  'chain.no_delegations': {
    en: 'No delegation is recorded against this slot.',
    ar: 'لا يوجد تفويض مسجَّل على هذا الشاغر.',
  },
  'chain.not_found': {
    en: 'The registry holds no trust chain for slot {id}.',
    ar: 'لا توجد سلسلة ثقة في السجل للشاغر {id}.',
  },
  'chain.delegated_to': { en: 'Delegated to', ar: 'مُفوَّض إلى' },
  'chain.delegated_from': { en: 'Delegated by', ar: 'مُفوَّض من' },

  // ---- Screen 15 — delegation register -----------------------------------
  'delegations.lede': {
    en: 'Each row is one delegation of authority from one SPID to another, with the tasks it covers and the date it lapses.',
    ar: 'كل صف هو تفويض صلاحيّة من معرّف إلى آخر، مع المهام التي يشملها وتاريخ انتهائه.',
  },
  'delegations.empty': {
    en: 'No delegation is recorded against this slot.',
    ar: 'لا يوجد تفويض مسجَّل على هذا الشاغر.',
  },
  'delegations.col.id': { en: 'Delegation', ar: 'التفويض' },
  'delegations.col.from': { en: 'From', ar: 'من' },
  'delegations.col.to': { en: 'To', ar: 'إلى' },
  'delegations.col.tasks': { en: 'Tasks in scope', ar: 'المهام المشمولة' },
  'delegations.col.internal': { en: 'Internal', ar: 'داخلي' },
  'delegations.col.expires': { en: 'Expires', ar: 'ينتهي في' },
  'delegations.col.signature': { en: 'Signature', ar: 'التوقيع' },
  'delegations.no_tasks': { en: 'No tasks recorded', ar: 'لا مهام مسجَّلة' },
  'delegations.not_found': {
    en: 'The registry holds no delegation register for slot {id}.',
    ar: 'لا يوجد سجل تفويضات في السجل للشاغر {id}.',
  },

  // ---- Screen 16 — sub-slot tree -----------------------------------------
  'tree.lede': {
    en: 'This is the one screen that nests. A child row is a slot whose parent_slot points at the row above it.',
    ar: 'هذه الشاشة الوحيدة التي تُظهر تداخلًا. الصف الفرعي شاغر يشير حقل parent_slot فيه إلى الصف الذي فوقه.',
  },
  'tree.children': { en: 'Sub-slots', ar: 'شواغر فرعية' },
  'tree.no_children': { en: 'This slot has no sub-slots.', ar: 'لا توجد شواغر فرعية لهذا الشاغر.' },
  'tree.child_of': { en: 'Child of {id}', ar: 'فرعي لـ {id}' },
  'tree.parent_row': { en: 'Parent slot', ar: 'الشاغر الأب' },
  'tree.not_a_parent': {
    en: 'Slot {id} is itself a sub-slot, so it has no children of its own. Its own parent is shown above.',
    ar: 'الشاغر {id} نفسه شاغر فرعي، لذا لا له شواغر فرعية. شاغره الأب معروض أعلاه.',
  },
  'tree.not_found': {
    en: 'The registry holds no slot with the identifier {id}, so there is no tree to show.',
    ar: 'لا يوجد في السجل شاغر بالمعرّف {id}، لذا لا شجرة لعرضها.',
  },

  // ---- Screen 17 — trust ladder ------------------------------------------
  'ladder.lede': {
    en: 'A rung is the most a record may claim. Nothing here promotes a claim: a rung is filled only when the registry says it was reached.',
    ar: 'الدرجة هي أقصى ما يمكن للسجل أن يدّعيه. لا شيء هنا يُرقّي مُدّعًى: الدرجة لا تُملأ إلا عندما يقول السجل إنها تحقّقت.',
  },
  'ladder.requires': { en: 'Reached when', ar: 'تتحقق عندما' },
  'ladder.search_label': { en: 'Look up a member', ar: 'ابحث عن مزوّد' },
  'ladder.search_placeholder': { en: 'SPID, e.g. SA-PHY-000001', ar: 'معرّف المزوّد، مثال SA-PHY-000001' },
  'ladder.search_cta': { en: 'Mark this rung', ar: 'ضع علامة على هذه الدرجة' },
  'ladder.search_hint': {
    en: 'Enter a SPID to mark where that member stands on the ladder.',
    ar: 'أدخل معرّف مزوّد لتحديد موقعه على السُلّم.',
  },
  'ladder.result_none': {
    en: 'No registered member carries the identifier {spid}.',
    ar: 'لا يوجد مزوّد مسجّل بالمعرّف {spid}.',
  },
  'ladder.result_found': {
    en: '{spid} stands at rung {rung} of {max}. {state}.',
    ar: 'يقف {spid} عند الدرجة {rung} من {max}. {state}.',
  },
  'ladder.state_filled': { en: 'Reached', ar: 'متحقَّقة' },
  'ladder.state_available': { en: 'Not yet reached', ar: 'لم تتحقق' },
  'ladder.state_unreached': { en: 'Beyond this member', ar: 'أبعد من هذا المزوّد' },

  // ---- Screen 4 — trust passport (task 6) ---------------------------------
  'registry.passport': { en: 'Trust passport', ar: 'جواز الثقة' },
  'passport.lede': {
    en: 'Everything on this page is read live from the registry. Where a field is withheld, it says so; it never shows a blank and never shows a placeholder name.',
    ar: 'كل ما في هذه الصفحة يُقرأ مباشرةً من السجل. وحقل مكتوم، تُذكر ذلك صراحةً؛ لا يظهر فارغًا ولا باسم بديل.',
  },
  'passport.doc_id': { en: 'Document', ar: 'الوثيقة' },
  'passport.qr': { en: 'Verification target', ar: 'هدف التحقّق' },
  'passport.qr_hint': {
    en: 'The credential re-reads from this address. It is the registry’s own record, not a copy held by this page.',
    ar: 'تُعاد قراءة المُدّعَى من هذا العنوان. إنه سجل السجل نفسه، لا نسخة محفوظة في هذه الصفحة.',
  },
  'passport.jurisdiction': { en: 'Jurisdiction', ar: 'الاختصاص القضائي' },
  'passport.class': { en: 'Record class', ar: 'صنف السجل' },
  'passport.arc': { en: 'OID arc', ar: 'قوس OID' },
  'passport.withheld_reason': { en: 'Withheld because', ar: 'مكتوم لأن' },
  'passport.valid': { en: 'Identifier resolves', ar: 'المعرّف يُحلّ' },
  'passport.not_found': {
    en: 'The registry holds no member with the identifier {spid}, so no credential document can be issued here.',
    ar: 'لا يوجد في السجل مزوّد بالمعرّف {spid}، لذا لا يمكن إصدار وثيقة مُدّعًى هنا.',
  },
  'passport.no_spid': {
    en: 'No provider identifier in this URL, so there is no passport to issue.',
    ar: 'لا يوجد معرّف مزوّد في هذا الرابط، لذا لا جواز لإصداره.',
  },

  // ---- Screen 5 — verify (task 6) -----------------------------------------
  'registry.verify': { en: 'Verify a credential', ar: 'تحقّق من مُدّعًى' },
  'verify.lede': {
    en: 'Enter an identifier and the registry answers from the record it holds right now — not from a cache on this page.',
    ar: 'أدخل معرّفًا، فيجيب السجل من السجل الذي يحتفظ به الآن — لا من ذاكرة مؤقتة في هذه الصفحة.',
  },
  'verify.input_label': { en: 'Provider identifier', ar: 'معرّف المزوّد' },
  'verify.input_placeholder': { en: 'SA-PHY-000001', ar: 'SA-PHY-000001' },
  'verify.cta': { en: 'Verify', ar: 'تحقّق' },
  'verify.verdict': { en: 'Verdict', ar: 'الحُكم' },
  'verify.verdict_true': {
    en: 'The evidence supports this claim.',
    ar: 'الأدلة تدعم هذا المُدّعَى.',
  },
  'verify.verdict_false': {
    en: 'The evidence does not yet support this claim.',
    ar: 'الأدلة لا تدعم هذا المُدّعَى بعد.',
  },
  'verify.membership': { en: 'Membership', ar: 'العضوية' },
  'verify.membership_active': { en: 'Active', ar: 'نشِطة' },
  'verify.membership_inactive': { en: 'Not active', ar: 'غير نشِطة' },
  'verify.credentials': { en: 'Credentials checked', ar: 'المؤهلات المُتحقَّق منها' },
  'verify.public_profile': { en: 'Public profile', ar: 'الملف العام' },
  'verify.consent_source': { en: 'Consent source', ar: 'مصدر الموافقة' },
  'verify.ladder_position': { en: 'Ladder position', ar: 'موقعه على السُلّم' },
  'verify.chain_link': { en: 'Trust chain for the held slot', ar: 'سلسلة الثقة للشاغر المحجوز' },
  'verify.passport_link': { en: 'Open the trust passport', ar: 'افتح جواز الثقة' },
  'verify.result_none': {
    en: 'The registry holds no member with the identifier {spid}. Nothing is shown because nothing was returned.',
    ar: 'لا يوجد في السجل مزوّد بالمعرّف {spid}. لا يُعرض شيء لأن السجل لم يُرجع شيئًا.',
  },
  'verify.result_none_hint': {
    en: 'Check the identifier, or open the provider directory to read the identifiers the registry does hold.',
    ar: 'تحقّق من المعرّف، أو افتح دليل المزوّدين لقراءة المعرّفات التي يحتفظ بها السجل.',
  },
  'verify.result_mismatch': {
    en: 'The registry answered about a different record, so nothing is shown for {spid}.',
    ar: 'أجاب السجل عن سجل مختلف، لذا لا يُعرض شيء للمعرّف {spid}.',
  },
  'verify.ladder_cta': { en: 'See the full ladder', ar: 'اعرض السُلّم كاملًا' },

  // ---- Screen 6 — verify by phone (task 6) --------------------------------
  'registry.verify_phone': { en: 'Verify at the bedside', ar: 'تحقّق عند السرير' },
  'phone.lede': {
    en: 'One identifier in, one answer out. The answer is the largest thing on this page, because at the bedside there is no time to read around it.',
    ar: 'معرّف واحد يدخل، وجواب واحد يخرج. الجواب أكبر ما في هذه الصفحة، فعند السرير لا وقت للقراءة حوله.',
  },
  'phone.input_label': { en: 'Scan or type the identifier', ar: 'امسح المعرّف أو اكتبه' },
  'phone.cta': { en: 'Show the answer', ar: 'اعرض النتيجة' },
  'phone.answer_label': { en: 'Answer', ar: 'الجواب' },
  'phone.answer_waiting': {
    en: 'No identifier entered yet.',
    ar: 'لم يُدخل أي معرّف بعد.',
  },
  'phone.result_none': {
    en: 'Not in the registry. Check the identifier and read again.',
    ar: 'غير موجود في السجل. تحقّق من المعرّف وأعد القراءة.',
  },
  'phone.rung_readout': { en: 'Rung', ar: 'الدرجة' },
  'phone.badge_readout': { en: 'Badge', ar: 'العلامة' },
  'phone.withheld_readout': { en: 'Name', ar: 'الاسم' },
  'phone.consent_pending': { en: 'Consent pending', ar: 'بانتظار الموافقة' },
  'phone.step_of': { en: 'Step {n}', ar: 'الخطوة {n}' },
  'phone.large_answer_tip': {
    en: 'Read the state, then the rung. Everything else on a credential is supporting detail.',
    ar: 'اقرأ الحالة ثم الدرجة. ما عدا ذلك في المُدّعَى تفاصيل داعمة.',
  },

  // ---- Screen 21 — consent capture (task 10) -------------------------------
  'registry.consent': { en: 'Consent & publication', ar: 'الموافقة والنشر' },
  'consent.screen_lede': {
    en: 'This screen lists exactly which fields the registry is holding back for one member, and what recording consent would change. It reads the registry live; it writes nothing.',
    ar: 'تعرض هذه الشاشة تحديدًا الحقول التي يحتجزها السجل لمزوّد واحد، وما الذي سيتغيّر بتسجيل الموافقة. وهي تقرأ السجل مباشرةً ولا تكتب شيئًا.',
  },
  'consent.state_label': { en: 'Publication state', ar: 'حالة النشر' },
  'consent.reason_label': { en: 'Reason recorded', ar: 'السبب المُسجَّل' },
  'consent.reason_default': {
    en: 'The registry has not recorded a reason for this member.',
    ar: 'لم يُسجّل السجل سببًا لهذا المزوّد.',
  },
  'consent.reason_source': {
    en: 'Stated by the registry',
    ar: 'مذكور من السجل',
  },
  'consent.reason_inferred': {
    en: 'No reason was returned; this is the default the registry applies.',
    ar: 'لم يُرجع السجل سببًا؛ وهذا هو الافتراضي الذي يطبّقه السجل.',
  },
  'consent.credential_fields': { en: 'Held back on the credential record', ar: 'محجوزة في سجل المُدّعَى' },
  'consent.partner_fields': { en: 'Held back on the partner record', ar: 'محجوزة في سجل الشريك' },
  'consent.field_count': { en: '{count} field(s) withheld', ar: '{count} حقل محجوز' },
  'consent.no_fields': {
    en: 'The registry returned no withheld field on this record.',
    ar: 'لم يُرجع السجل أي حقل محجوز في هذا السجل.',
  },
  'consent.field_redacted': { en: 'Withheld under the identity rule', ar: 'محجوزة بموجب قاعدة الهوية' },
  'consent.field_unpopulated': { en: 'Not populated', ar: 'غير مُعبّأ' },
  'consent.public_profile': { en: 'Public profile served', ar: 'الملف العام مُقدَّم' },
  'consent.source_label': { en: 'Consent source', ar: 'مصدر الموافقة' },
  'consent.source_none': {
    en: 'None recorded. No consent of any kind has been stored for this member.',
    ar: 'لا يوجد مصدر مُسجَّل. لم يُحفظ أي نوع من الموافقة لهذا المزوّد.',
  },
  'consent.source_operator_asserted': {
    en: 'operator_asserted — an operator’s belief. This does not publish anything.',
    ar: 'operator_asserted — اعتقاد مُشغّل. وهذا لا ينشر شيئًا.',
  },
  'consent.source_acknowledged': {
    en: 'subject_acknowledged — the subject agreed. This is the only source that publishes.',
    ar: 'subject_acknowledged — وافق صاحب السجل نفسه. وهذا هو المصدر الوحيد الذي ينشر.',
  },
  'consent.source_other': {
    en: 'Recorded as “{source}”.',
    ar: 'مُسجَّل باسم «{source}».',
  },

  // ---- What acknowledgement does and does not do --------------------------
  'consent.does_title': { en: 'What recording it does', ar: 'ما الذي يُحدثه التسجيل' },
  'consent.does_1': {
    en: 'Lifts the identity-withheld flag, so the name and business name become readable on the public dossier and directory.',
    ar: 'يرفع علامة حجب الهوية، فيصبح الاسم واسم المؤسسة قابلين للقراءة في الملف العام والدليل.',
  },
  'consent.does_2': {
    en: 'Allows the public profile to be served for this member.',
    ar: 'يسمح بتقديم الملف العام لهذا المزوّد.',
  },
  'consent.does_3': {
    en: 'Is recorded against the SPID, so it can be shown on the credential document as the source of publication.',
    ar: 'يُسجَّل مقابل معرّف المزوّد، فيمكن عرضه في وثيقة المُدّعَى كمصدر النشر.',
  },
  'consent.doesnot_title': { en: 'What it does not do', ar: 'ما لا يفعله' },
  'consent.doesnot_1': {
    en: 'It does not verify a licence, a registration, or any credential against a regulator.',
    ar: 'لا يتحقّق من رخصة أو تسجيل أو أي مؤهّل مقابل جهة تنظيمية.',
  },
  'consent.doesnot_2': {
    en: 'It does not move the member up the verification ladder. The rung changes only when evidence does.',
    ar: 'لا ينقل المزوّد إلى درجة أعلى على سُلّم التوثيق. لا تتغيّر الدرجة إلا بتغيّر الأدلة.',
  },
  'consent.doesnot_3': {
    en: 'It does not agree to anything else on the member’s behalf — no data sharing, no clinical access, no marketing.',
    ar: 'لا يوافق على أي شيء آخر نيابةً عن المزوّد — لا مشاركة بيانات، ولا وصول سريري، ولا تسويق.',
  },
  'consent.doesnot_4': {
    en: 'It does not publish clinical, patient, or payment data. Those are never on this registry.',
    ar: 'لا ينشر بيانات سريرية أو لمرضى أو للدفع. فهذه ليست على هذا السجل إطلاقًا.',
  },

  // ---- The acknowledgement control ----------------------------------------
  'consent.ack_title': { en: 'Acknowledge publication', ar: 'أقرّ بالنشر' },
  'consent.ack_body': {
    en: 'This control states your acknowledgement. It is recorded by an operator with registry access, against the SPID above, with the date it was given.',
    ar: 'هذا الإقرار يسجّل موافقتك. ويسجّله مُشغّل يملك صلاحية السجل، مقابل معرّف المزوّد أعلاه، مع تاريخ الإعطاء.',
  },
  'consent.ack_label': {
    en: 'I agree that my name and business name may be published on the public registry, and I understand the limits listed above.',
    ar: 'أوافق على نشر اسمي واسم مؤسستي في السجل العام، وأُدرك الحدود المبيّنة أعلاه.',
  },
  'consent.ack_staged_title': { en: 'Acknowledgement recorded on this device', ar: 'سُجّل الإقرار على هذا الجهاز' },
  'consent.ack_staged_body': {
    en: 'Your acknowledgement has been noted in this browser only. Nothing has been sent to the registry, and no name has been published. An operator with registry access must record it for the registry to change.',
    ar: 'سُجّلت موافقتك في هذا المتصفح فقط. ولم يُرسَل شيء إلى السجل، ولم يُنشر أي اسم. وعلى مُشغّل يملك صلاحية السجل أن يسجّله عندها만 يتغيّر السجل.',
  },
  'consent.ack_operator_note': {
    en: 'Recording this requires registry write access, which this page does not hold and does not ask for. The write is made server-side by an operator, never from a public page.',
    ar: 'يتطلب تسجيل ذلك صلاحية كتابة في السجل، وهي لا تتوفر لهذه الصفحة ولا تطلبها. فالكتابة تتم من الخادم بواسطة مُشغّل، لا من صفحة عامة إطلاقًا.',
  },
  'consent.ack_operator_cta': {
    en: 'Show this screen to the operator who holds registry access',
    ar: 'اعرض هذه الشاشة على المُشغّل الذي يملك صلاحية السجل',
  },
  'consent.spelling': { en: 'Provider identifier', ar: 'معرّف المزوّد' },
  'consent.not_found': {
    en: 'The registry holds no member with the identifier {spid}, so there is no consent state to show.',
    ar: 'لا يوجد في السجل مزوّد بالمعرّف {spid}، لذا لا حالة موافقة لعرضها.',
  },

  // ---- Screen 18 — partner (task 11) ---------------------------------------
  'registry.partner': { en: 'Partner record', ar: 'سجل الشريك' },
  'partner.lede': {
    en: 'One aggregate read of everything the registry holds for a partner: the slots they hold and publish, the delegations they have made, what they owe, where they peer, and how far provisioning got.',
    ar: 'قراءة واحدة مجمّعة لكل ما يحتفظ به السجل عن شريك: الشواغر التي يحتجزها وينشرها، والتفويضات التي منحها، وما عليه، وموقع اتصاله، وكم بلغ التجهيز.',
  },
  'partner.slots_held': { en: 'Slots held', ar: 'الشواغر المحجوزة' },
  'partner.slots_published': { en: 'Slots published', ar: 'الشواغر المنشورة' },
  'partner.delegations': { en: 'Delegations', ar: 'التفويضات' },
  'partner.ledger': { en: 'Ledger', ar: 'دفتر الحساب' },
  'partner.balance': { en: 'Balance', ar: 'الرصيد' },
  'partner.network': { en: 'Network', ar: 'الشبكة' },
  'partner.provisioning': { en: 'Provisioning', ar: 'التجهيز' },
  'partner.links': { en: 'Linked records', ar: 'السجلات المرتبطة' },
  'partner.no_slots': {
    en: 'This partner holds no slot.',
    ar: 'لا يحتجز هذا الشريك أي شاغر.',
  },
  'partner.no_published': {
    en: 'This partner publishes no slot.',
    ar: 'لا ينشر هذا الشريك أي شاغر.',
  },
  'partner.no_delegations': {
    en: 'This partner has made no delegation.',
    ar: 'لم يُنشئ هذا الشريك أي تفويض.',
  },

  // ---- Screen 19 — provisioning (task 11) ---------------------------------
  'registry.provisioning': { en: 'Provisioning', ar: 'التجهيز' },
  'prov.lede': {
    en: 'Provisioning runs as a sequence of steps. The list below is whatever the registry returned, in the order it returned them — a step added to the worker tomorrow appears here tomorrow without this page being changed.',
    ar: 'يجري التجهيز كسلسلة خطوات. والقائمة أدناه هي ما أرجعه السجل، بالترتيب الذي أرجعه به — فالخطوة التي تُضاف إلى المُشغّل غدًا ستظهر هنا غدًا دون تعديل هذه الصفحة.',
  },
  'prov.complete': { en: 'Complete', ar: 'مكتمل' },
  'prov.incomplete': { en: 'Not complete', ar: 'غير مكتمل' },
  'prov.complete_yes': {
    en: 'The registry reports this record as fully provisioned.',
    ar: 'يبلّغ السجل بأن هذا السجل مُجهَّز بالكامل.',
  },
  'prov.complete_no': {
    en: 'The registry reports this record as not fully provisioned.',
    ar: 'يبلّغ السجل بأن هذا السجل غير مُجهَّز بالكامل.',
  },
  'prov.at': { en: 'At', ar: 'في' },
  'prov.no_steps': {
    en: 'The registry returned no provisioning step for this member.',
    ar: 'لم يُرجع السجل أي خطوة تجهيز لهذا المزوّد.',
  },
  'prov.detail': { en: 'Recorded detail', ar: 'التفاصيل المُسجّلة' },

  // Provisioning step names. A mapping, not a list: an unmapped step still
  // renders, under its own registry token, because an open set that drops
  // unknown members is a closed set wearing a disguise.
  'provstep.identity': { en: 'Identity', ar: 'الهوية' },
  'provstep.profile': { en: 'Profile', ar: 'الملف' },
  'provstep.storefront': { en: 'Storefront', ar: 'الواجهة' },
  'provstep.erp': { en: 'ERP record', ar: 'سجل ERP' },
  'provstep.commerce': { en: 'Commerce', ar: 'التجارة' },
  'provstep.auto_provisioned': { en: 'Auto-provisioned', ar: 'تجهيز آلي' },

  // Provisioning statuses, same rule as the steps.
  'provstatus.done': { en: 'Done', ar: 'منجزة' },
  'provstatus.pending': { en: 'Pending', ar: 'قيد الانتظار' },
  'provstatus.failed': { en: 'Failed', ar: 'فشلت' },
  'provstatus.skipped': { en: 'Skipped', ar: 'متجاوَزة' },

  // ---- Screen 20 — network (task 11) --------------------------------------
  'registry.network': { en: 'Network peers', ar: 'شركاء الشبكة' },
  'net.lede': {
    en: 'Where each provider peers, and whether the registry has verified that claim. Verification is read from the record; it is never inferred from a trust level, because a trust level is an opinion about a person and a peering fact is a measurement about a network.',
    ar: 'أين يتصل كل مزوّد، وهل تحقّق السجل من هذا المُدّعَى. أمّا التحقّق فيُقرأ من السجل ولا يُستنتج من مستوى الثقة، لأن مستوى الثقة رأيٌ في شخص، وواقعة الاتصال قياسٌ لشبكة.',
  },
  'net.count': { en: '{count} provider(s) on the network', ar: '{count} مزوّد على الشبكة' },
  'net.ix_name': { en: 'Exchange', ar: 'مركز التبادل' },
  'net.asn': { en: 'ASN', ar: 'رقم ASN' },
  'net.peering': { en: 'Peering type', ar: 'نوع الاتصال' },
  'net.facility': { en: 'Facility', ar: 'المنشأة' },
  'net.uptime': { en: 'Uptime SLA', ar: 'اتفاقية التشغيل' },
  'net.peers': { en: 'Peers', ar: 'الشركاء' },
  'net.bandwidth': { en: 'Bandwidth', ar: 'النطاق' },
  'net.gbps': { en: '{n} Gbps', ar: '{n} جيجابت/ث' },
  'net.verified': { en: 'Verified by the registry', ar: 'مُتحقَّق منه بواسطة السجل' },
  'net.unverified': {
    en: 'Not verified by the registry. The record makes no verified claim about this peering.',
    ar: 'غير مُتحقَّق منه بواسطة السجل. لا يدّعي السجل أي مُدّعًى مُتحقَّق عنه عن هذا الاتصال.',
  },
  'net.ipv6': { en: 'IPv6', ar: 'IPv6' },
  'net.no_providers': {
    en: 'The registry returned no provider on the network.',
    ar: 'لم يُرجع السجل أي مزوّد على الشبكة.',
  },
  'net.total_mismatch': {
    en: 'The registry declares {total} provider(s) and returned {shown}. Both numbers are shown as they arrived.',
    ar: 'يُعلن السجل {total} مزوّدًا وأعاد {shown}. يُعرض الرقمان كما وصلا.',
  },

  // Peering types, mapped rather than listed, for the same open-set reason.
  'peering.public-peering': { en: 'Public peering', ar: 'اتصال عام' },
  'peering.route-server': { en: 'Route server', ar: 'خادم مسارات' },
  'peering.private': { en: 'Private interconnect', ar: 'ربط خاص' },
  'peering.transit': { en: 'Transit', ar: 'عبور' },

  // ---- Screen 7 — claim wizard (task 12) ----------------------------------
  'registry.claim': { en: 'Claim a credential', ar: 'ادّعِ مُدّعًى' },
  'claim.lede': {
    en: 'Four steps: find the record, attach the evidence, read it over, and file it. This page assembles a claim for a person to check and send. It files nothing.',
    ar: 'أربع خطوات: اعثر على السجل، وأرفق الدليل، واقرأه مرّة أخرى، ثم أودعه. هذه الصفحة تُجمّع مُدّعًى ليقرأه الشخص ويرسله. وهي لا تُودع شيئًا.',
  },
  // The four steps. English is the working wording; Arabic is the Gen-B p20
  // mirror, which is the phrasing a member reads in the room.
  'claim.step.1': { en: 'Find profile', ar: 'اعثر على السجل' },
  'claim.step.2': { en: 'Add evidence', ar: 'أظهر الدليل' },
  'claim.step.3': { en: 'Review', ar: 'اقرأه مرّة أخرى' },
  'claim.step.4': { en: 'Submitted', ar: 'تم الإيداع' },
  'claim.input_label': { en: 'Provider identifier', ar: 'معرّف المزوّد' },
  'claim.find_cta': { en: 'Find the record', ar: 'ابحث عن السجل' },
  'claim.found': {
    en: 'Found {spid} at rung {rung} of {max}. Add the evidence that would move it.',
    ar: 'وُجد {spid} عند الدرجة {rung} من {max}. أضف الدليل الذي يرفعها.',
  },
  'claim.not_found': {
    en: 'The registry holds no member with the identifier {spid}.',
    ar: 'لا يوجد في السجل مزوّد بالمعرّف {spid}.',
  },
  'claim.evidence_title': { en: 'Evidence', ar: 'الدليل' },
  'claim.evidence_hint': {
    en: 'Choose what you hold. The registry decides which rung each item can reach — this page does not.',
    ar: 'اختر ما تملكه. والسجل هو الذي يقرر أي درجة يبلغ كل دليل، لا هذه الصفحة.',
  },
  'claim.evidence.licence': { en: 'Licence certificate', ar: 'شهادة رخصة' },
  'claim.evidence.national_id': { en: 'National ID', ar: 'الهوية الوطنية' },
  'claim.evidence.facility_letter': { en: 'Facility letter', ar: 'خطاب من المنشأة' },
  'claim.evidence_selected': { en: 'Selected: {count}', ar: 'المُختار: {count}' },
  'claim.evidence_none': { en: 'Nothing selected yet.', ar: 'لم يُختر شيء بعد.' },
  'claim.review_title': { en: 'Read it over', ar: 'اقرأه مرّة أخرى' },
  'claim.review_body': {
    en: 'Check every line. An evidence item that does not match the record will be sent back, and a wrong claim costs the member a rung of trust they had already earned.',
    ar: 'راجع كل سطر. فالدليل الذي لا يطابق السجل سيُعاد، والمُدّعَى الخاطئ يكلّف المزوّد درجةَ ثقةً كان قد كسبها.',
  },
  'claim.file_cta': { en: 'File this claim', ar: 'أودع هذا المُدّعَى' },
  'claim.filed_title': { en: 'Filed for the operator', ar: 'أُودع للمُشغّل' },
  'claim.filed_body': {
    en: 'Your claim is assembled on this device and has been handed to nobody. It exists in this browser until an operator with registry access files it against the SPID.',
    ar: 'مُدّعاك مُجمَّع على هذا الجهاز ولم يُسلَّم إلى أحد. وهو قائم في هذا المتصفح حتى يودعه مُشغّل يملك صلاحية السجل مقابل معرّف المزوّد.',
  },
  'claim.no_write_note': {
    en: 'This page writes nothing to the registry. There is no endpoint here that files a claim, and no credential here that could.',
    ar: 'هذه الصفحة لا تكتب شيئًا في السجل. ولا يوجد فيها أي نقطة نهاية تُودع مُدّعًى، ولا أي مُنشئ مفتاح يمكنه ذلك.',
  },
  'claim.back': { en: 'Back', ar: 'رجوع' },
  'claim.next': { en: 'Next', ar: 'التالي' },

  // ---- Screen 8 — facility registration (task 12) ------------------------
  'registry.register': { en: 'Register a facility', ar: 'سجّل منشأة' },
  'register.lede': {
    en: 'A facility — a clinic, laboratory, pharmacy or physician group — receives its identifier under one class arc, fixed by the registry so that every facility type is predictable. This page shows what would be assigned. It mints nothing.',
    ar: 'المنشأة — عيادة أو مختبر أو صيدلية أو مجموعة أطباء — تتلقّى معرّفها تحت قوس صنف واحد يثبّته السجل، فتكون كل أنواع المنشآت قابلة للتنبؤ. وتعرض هذه الصفحة ما سيُخصَّص، وهي لا تُصدر شيئًا.',
  },
  'register.form_title': { en: 'Facility', ar: 'المنشأة' },
  'register.type_label': { en: 'Facility class', ar: 'صنف المنشأة' },
  'register.name_label': { en: 'Facility name', ar: 'اسم المنشأة' },
  'register.city_label': { en: 'City', ar: 'المدينة' },
  'register.arc_title': { en: 'Identifier that would be assigned', ar: 'المعرّف الذي سيُخصَّص' },
  'register.arc_body': {
    en: 'The namespace and the class arc are fixed by the registry. Only the sequence number is issued, and only by the registry, after the record is approved.',
    ar: 'المجال القضيائي وقوس الصنف يثبّتهما السجل. أما رقم التسلسل فيُصدره السجل وحده، وبعد الموافقة على السجل.',
  },
  'register.class.FAC': { en: 'Facility', ar: 'منشأة' },
  'register.class.CLI': { en: 'Clinic', ar: 'عيادة' },
  'register.class.LAB': { en: 'Laboratory', ar: 'مختبر' },
  'register.class.PHM': { en: 'Pharmacy', ar: 'صيدلية' },
  'register.class.ORG': { en: 'Organisation', ar: 'مؤسسة' },
  'register.class.PHY': { en: 'Physician', ar: 'طبيب' },
  'register.class.NUR': { en: 'Nurse', ar: 'ممرّض' },
  'register.class.PHA': { en: 'Pharmacist', ar: 'صيدلي' },
  'register.no_mint_note': {
    en: 'No identifier is issued here. Minting an OID is a registry write reserved to an operator with registry access; this page only shows the arc a given class would fall under.',
    ar: 'لا يُصدر أي معرّف هنا. فإصدار OID كتابة في السجل محجوزة للمُشغّل صاحب الصلاحية؛ وهذه الصفحة تعرض القوس الذي يقع تحته صنفٌ محدّد فقط.',
  },
  'register.choose_type': {
    en: 'Choose a facility class to see its arc.',
    ar: 'اختر صنف المنشأة لعرض قوسه.',
  },

  // ---- Screen 9 — operator desk (task 12) --------------------------------
  'registry.desk': { en: 'Operator desk', ar: 'مكتب المُشغّل' },
  'desk.lede': {
    en: 'Slot requests waiting on a decision. This queue is operator-only, so this page shows you what it would show an operator and nothing more.',
    ar: 'طلبات الشواغر التي تنتظر قرارًا. هذه الطابور مخصّص للمُشغّل، لذا تعرض هذه الصفحة ما تعرضه لمُشغّل فحسب.',
  },
  'desk.gate_title': { en: 'Operator access required', ar: 'يلزم وصول المُشغّل' },
  'desk.gate_body': {
    en: 'The request queue is not public. The registry returned “not authorised” for this read, which is the correct answer and is reported here as it came back — this page holds no credential and does not ask for one.',
    ar: 'طابور الطلبات ليس عامًا. أعاد السجل «غير مصرّح» لهذه القراءة، وهذا هو الجواب الصحيح ويُعرض هنا كما جاء — وهذه الصفحة لا تحتفظ بأي مُنشئ مفتاح ولا تطلبه.',
  },
  'desk.gate_http': { en: 'Registry answered: {code}', ar: 'أجاب السجل: {code}' },
  'desk.gate_cta': {
    en: 'This page is a read-only view. A person with registry access runs the query behind it.',
    ar: 'هذه الصفحة عرض للقراءة فقط. والاستعلام عن السجل يجريه شخص يملك صلاحيته.',
  },
  'desk.col.id': { en: 'Request', ar: 'الطلب' },
  'desk.col.slot': { en: 'Slot', ar: 'الشاغر' },
  'desk.col.requester': { en: 'Requester', ar: 'الطالب' },
  'desk.col.state': { en: 'State', ar: 'الحالة' },
  'desk.col.at': { en: 'Raised', ar: 'تاريخ الرفع' },
  'desk.empty': { en: 'The registry returned no request.', ar: 'لم يُرجع السجل أي طلب.' },
  'desk.readonly_note': {
    en: 'This read succeeded, so rows are shown. The page still writes nothing: approving, rejecting and provisioning are operator actions made against the registry.',
    ar: 'نجحت هذه القراءة، لذا تُعرض الصفوف. ومع ذلك لا تكتب الصفحة شيئًا: فالموافقة والرفض والتجهيز إجراءات مُشغّل تُنفَّذ على السجل.',
  },
  // Request states, spelled exactly as stateChip('request', …) labels them.
  'requeststate.requested': { en: 'Requested', ar: 'مطلوب' },
  'requeststate.approved': { en: 'Approved', ar: 'موافَق عليه' },
  'requeststate.rejected': { en: 'Rejected', ar: 'مرفوض' },
  'requeststate.provisioned': { en: 'Provisioned', ar: 'مُجهَّز' },

  // ---- Screen 10 — case file (task 12) -----------------------------------
  'registry.case': { en: 'Case file', ar: 'ملف الحالة' },
  'case.lede': {
    en: 'One case, assembled from the record the registry holds: what it is, who it concerns, what evidence was filed, and where it stands.',
    ar: 'حالة واحدة، مُجمَّعة من السجل الذي يحتفظ به السجل: ما هي، ومن تتعلق به، وأي دليل قدّم، وأين تقف.',
  },
  'case.fixture_note': {
    en: 'Design reference. The registry serves no public case endpoint, so the values below are fixtures shipped with this page to show the layout. They are not a case and must not be cited as one.',
    ar: 'مرجع تصميم. لا يقدّم السجل أي نقطة نهاية عامة للحالات، لذا القيم أدناه بيانات تجريبية مرفقة بهذه الصفحة لعرض التنسيق. وهي ليست حالة ولا يجوز الاستشهاد بها.',
  },
  'case.id': { en: 'Case', ar: 'الحالة' },
  'case.kind': { en: 'Kind', ar: 'النوع' },
  'case.subject': { en: 'Subject', ar: 'الموضوع' },
  'case.ref': { en: 'Reference', ar: 'المرجع' },
  'case.evidence': { en: 'Evidence filed', ar: 'الأدلة المقدَّمة' },
  'case.status': { en: 'Status', ar: 'الحالة' },
  'case.opened': { en: 'Opened', ar: 'فُتحت في' },
  'case.none': { en: 'No evidence was filed on this case.', ar: 'لم يُقدَّم أي دليل في هذه الحالة.' },
  'case.kind.identity': { en: 'Identity dispute', ar: 'نزاع هوية' },
  'case.kind.claim': { en: 'Claim dispute', ar: 'نزاع مُدّعًى' },
  'case.kind.ladder': { en: 'Ladder appeal', ar: 'استئناف درجة' },
  'case.kind.registration': { en: 'Registration review', ar: 'مراجعة تسجيل' },
  'case.status.open': { en: 'Open', ar: 'مفتوحة' },
  'case.status.in_review': { en: 'In review', ar: 'قيد المراجعة' },
  'case.status.held': { en: 'Held', ar: 'موقوفة' },
  'case.status.closed': { en: 'Closed', ar: 'مغلقة' },
  'case.not_found': {
    en: 'No case object was supplied for {id}, so there is nothing to show. This is a component screen: it renders a case it is given.',
    ar: 'لم تُقدَّم أي كائن حالة للمعرّف {id}، فلا شيء لعرضه. هذه شاشة مكوّن: تعرض الحالة التي تُعطى لها.',
  },

  // ---- Screen 11 — federation peers (task 12) -----------------------------
  'registry.peers': { en: 'Federation', ar: 'الاتحاد' },
  'peers.lede': {
    en: 'A federation is two registries pointing at each other. Each peer shows what their side holds, what ours holds, and which side is holding the bridge up.',
    ar: 'الاتحاد سجلّان يشيران أحدهما إلى الآخر. يعرض كل شريك ما عنده، وما عندنا، وأي جانب يقوم على الجسر.',
  },
  'peers.fixture_note': {
    en: 'Design reference. The registry serves no federation endpoint, so the values below are fixtures shipped with this page to show the layout. They are not peers and must not be cited as such.',
    ar: 'مرجع تصميم. لا يقدّم السجل أي نقطة نهاية للاتحاد، لذا القيم أدناه بيانات تجريبية مرفقة بهذه الصفحة لعرض التنسيق. وهي ليست شركاء ولا يجوز الاستشهاد بهم.',
  },
  'peers.theirs': { en: 'Their registry', ar: 'سجلّهم' },
  'peers.ours': { en: 'Our registry', ar: 'سجلّنا' },
  'peers.bridge': { en: 'Bridge', ar: 'الجسر' },
  'peers.published': { en: 'Published', ar: 'منشور' },
  'peers.not_published': { en: 'Not published', ar: 'غير منشور' },
  'peers.record_count': { en: '{count} record(s)', ar: '{count} سجل' },
  'peers.last_sync': { en: 'Last sync', ar: 'آخر مزامنة' },
  'peers.state.live': { en: 'Live', ar: 'يعمل' },
  'peers.state.waiting_them': { en: 'Waiting on them', ar: 'بانتظارهم' },
  'peers.state.waiting_us': { en: 'Waiting on us', ar: 'بانتظارنا' },
  'peers.state.neither': { en: 'Neither side yet', ar: 'لا جانب حتى الآن' },
  'peers.operator_note': {
    en: 'Accepting or withdrawing a federation is an operator action against the registry. This screen reports the state of each bridge; it does not offer a control that would appear to change it.',
    ar: 'قبول الاتحاد أو سحبه إجراء مُشغّل على السجل. وتعرض هذه الشاشة حالة كل جسر، ولا تقدّم زرًّا يوحي بإغييرها.',
  },

  // ---- Hiring & organizing (bpr-hiring) ---------------------------------
  'hiring.board': { en: 'Jobs & slots', ar: 'الوظائف والشواغر' },
  'hiring.lede': {
    en: 'Open roles posted by facilities, government bodies and provider organisations. Applications carry the same verified identity used across the registry.',
    ar: 'وظائف مفتوحة تنشرها المنشآت والجهات الحكومية ومؤسسات المزوّدين. وتحمل الطلبات نفس الهوية المُوثّقة المستخدمة في السجل.',
  },
  'hiring.summary': {
    en: '{open} open of {jobs} posting(s) · {apps} application(s) · {orgs} organisation(s)',
    ar: '{open} مفتوح من {jobs} إعلان · {apps} طلب · {orgs} مؤسسة',
  },
  'hiring.count': { en: '{count} posting(s)', ar: '{count} إعلان' },
  'hiring.filtered_count': { en: '{shown} of {total} shown', ar: 'يُعرض {shown} من {total}' },
  'hiring.filter.status': { en: 'Status', ar: 'الحالة' },
  'hiring.filter.type': { en: 'Posting type', ar: 'نوع الإعلان' },
  'hiring.filter.q': { en: 'Search', ar: 'بحث' },
  'hiring.filter.q_placeholder': { en: 'title, specialty, city', ar: 'العنوان، التخصّص، المدينة' },
  'hiring.filter.reset': { en: 'Clear filters', ar: 'امسح عوامل التصفية' },
  'hiring.type': { en: 'Posting type', ar: 'نوع الإعلان' },
  'hiring.location': { en: 'Location', ar: 'الموقع' },
  'hiring.salary': { en: 'Salary', ar: 'الراتب' },
  'hiring.posted_at': { en: 'Posted at', ar: 'تاريخ النشر' },
  'hiring.expires_at': { en: 'Expires at', ar: 'ينتهي في' },
  'hiring.requirements': { en: 'Requirements', ar: 'المتطلبات' },
  'hiring.pipeline': { en: 'Applicants', ar: 'المتقدّمون' },
  'hiring.applications_count': { en: '{count} application(s)', ar: '{count} طلب' },
  'hiring.score': { en: 'Score', ar: 'التقييم' },
  'hiring.empty': { en: 'No posting matches these filters.', ar: 'لا يوجد إعلان مطابق لعوامل التصفية.' },
  'hiring.empty_service': { en: 'The hiring service returned no postings.', ar: 'لم تُرجع خدمة التوظيف أي إعلان.' },
  'hiring.not_found': {
    en: 'The hiring service holds no posting with the identifier {id}.',
    ar: 'لا تحتفظ خدمة التوظيف بأي إعلان بالمعرّف {id}.',
  },
  'hiring.detail_lede': { en: 'Posting {id}', ar: 'الإعلان {id}' },
  'hiring.back': { en: 'Back to the job board', ar: 'العودة إلى لوحة الوظائف' },
  'hiring.link.orgs': { en: 'Organisations hiring', ar: 'المؤسسات التي توظّف' },
  'hiring.apply.title': { en: 'Apply for this posting', ar: 'تقدّم لهذا الإعلان' },
  'hiring.apply.spid': { en: 'Your provider SPID', ar: 'معرّف المزوّد الخاص بك' },
  'hiring.apply.name': { en: 'Your name', ar: 'اسمك' },
  'hiring.apply.message': { en: 'Message', ar: 'رسالة' },
  'hiring.apply.submit': { en: 'Submit application', ar: 'أرسل الطلب' },
  'hiring.apply.need_spid': { en: 'A provider SPID is required.', ar: 'معرّف المزوّد مطلوب.' },
  'hiring.apply.sending': { en: 'Submitting…', ar: 'جارٍ الإرسال…' },
  'hiring.apply.ok': { en: 'Application recorded: {id}', ar: 'تم تسجيل الطلب: {id}' },
  'hiring.apply.failed': { en: 'Application not recorded ({error}).', ar: 'لم يُسجَّل الطلب ({error}).' },

  // Job states (adapter.js stateChip('job', …))
  'jobstate.open': { en: 'Open', ar: 'مفتوح' },
  'jobstate.closed': { en: 'Closed', ar: 'مغلق' },
  'jobstate.filled': { en: 'Filled', ar: 'مُشغَل' },
  'jobstate.expired': { en: 'Expired', ar: 'منتهٍ' },

  // Application states (adapter.js stateChip('application', …))
  'applicationstate.applied': { en: 'Applied', ar: 'مُقدَّم' },
  'applicationstate.reviewing': { en: 'Reviewing', ar: 'قيد المراجعة' },
  'applicationstate.interview': { en: 'Interview', ar: 'مقابلة' },
  'applicationstate.assessment': { en: 'Assessment', ar: 'تقييم' },
  'applicationstate.offer': { en: 'Offer', ar: 'عرض' },
  'applicationstate.hired': { en: 'Hired', ar: 'تم التوظيف' },
  'applicationstate.rejected': { en: 'Rejected', ar: 'مرفوض' },
  'applicationstate.withdrawn': { en: 'Withdrawn', ar: 'مسحوب' },

  // ---- Organisations -----------------------------------------------------
  'org.directory': { en: 'Organisations', ar: 'المؤسسات' },
  'org.lede': {
    en: 'Facilities, government bodies, provider organisations and associations that post roles and hold registry identity.',
    ar: 'المنشآت والجهات الحكومية ومؤسسات المزوّدين والجمعيات التي تنشر الوظائف وتحمل هوية السجل.',
  },
  'org.count': { en: '{count} organisation(s)', ar: '{count} مؤسسة' },
  'org.name': { en: 'Organisation', ar: 'المؤسسة' },
  'org.type': { en: 'Type', ar: 'النوع' },
  'org.license': { en: 'Licence', ar: 'الترخيص' },
  'org.license_expiry': { en: 'Licence expiry', ar: 'انتهاء الترخيص' },
  'org.contact_email': { en: 'Contact email', ar: 'البريد الإلكتروني' },
  'org.contact_phone': { en: 'Contact phone', ar: 'هاتف التواصل' },
  'org.postings': { en: 'Postings', ar: 'الإعلانات' },
  'org.open_jobs': { en: '{count} open', ar: '{count} مفتوح' },
  'org.empty': { en: 'No organisation is registered yet.', ar: 'لم تُسجَّل أي مؤسسة بعد.' },
  'org.not_found': {
    en: 'No organisation is registered with the identifier {id}.',
    ar: 'لا توجد مؤسسة مسجّلة بالمعرّف {id}.',
  },
  'org.detail_lede': { en: 'Organisation {id}', ar: 'المؤسسة {id}' },
  // LinkedIn identity corroboration (bpr-linkedin) — identity only, never licensure.
  'linkedin.title': { en: 'LinkedIn identity', ar: 'هوية LinkedIn' },
  'linkedin.connect_lede': {
    en: 'Connect your LinkedIn account to corroborate this registry identity. LinkedIn attests the account holder — it does not replace professional licensure.',
    ar: 'اربط حسابك على LinkedIn لتأكيد هويتك في السجل. يؤكّد LinkedIn صاحب الحساب فقط — ولا يُغني عن الترخيص المهني.',
  },
  'linkedin.connect_cta': { en: 'Connect LinkedIn', ar: 'اربط LinkedIn' },
  'linkedin.verified_pill': { en: 'LinkedIn verified', ar: 'موثّق عبر LinkedIn' },
  'linkedin.profile': { en: 'Open profile', ar: 'افتح الملف' },
  'linkedin.subject': { en: 'LinkedIn subject', ar: 'معرّف LinkedIn' },
  'linkedin.name': { en: 'LinkedIn name', ar: 'الاسم على LinkedIn' },
  'linkedin.verified_at': { en: 'Connected at', ar: 'تاريخ الربط' },
  'linkedin.not_licence': {
    en: 'LinkedIn corroborates identity only — professional licensure remains with SCFHS.',
    ar: 'LinkedIn يؤكّد الهوية فقط — الترخيص المهني يبقى لدى الهيئة السعودية للتخصصات الصحية.',
  },
  'linkedin.verified_banner': {
    en: 'LinkedIn connected — your identity is now corroborated on this dossier.',
    ar: 'تم ربط LinkedIn — هويتك أصبحت موثّقة في هذا الملف.',
  },
};

function normaliseLang(lang) {
  return lang === 'ar' ? 'ar' : 'en';
}

function fill(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name) =>
    (Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole));
}

export function t(key, lang, vars) {
  const entry = Object.prototype.hasOwnProperty.call(STRINGS, key) ? STRINGS[key] : null;
  if (!entry) return null;
  const primary = entry[normaliseLang(lang)];
  // A key that ships only one language is an incomplete translation, not a
  // licence to render an English string under an Arabic page.
  const chosen = typeof primary === 'string' ? primary : entry.en;
  if (typeof chosen !== 'string') return null;
  return fill(chosen, vars);
}

// Convenience for the pages: the document title of a screen.
export function pageTitle(key, lang) {
  const label = t(key, lang);
  const brand = t('brand', lang);
  return label && brand ? `${label} · ${brand}` : (label || brand || '');
}

// Counts and keys are exposed so a test or a console can audit translation
// coverage without reaching into the private table.
export const i18nKeys = Object.keys(STRINGS);


// ---- Application shell + product copy (2026-10-14) ----------------------
Object.assign(STRINGS, {
  'shell.brand': { en: 'BrainSAIT Registry', ar: 'سجل BrainSAIT' },
  'shell.brand_sub': { en: 'SPID · OID · IDN/LGR · FHIR R4', ar: 'معرّف المزوّد · OID · الاسم العربي · FHIR' },
  'shell.live': { en: 'Live registry', ar: 'سجل مباشر' },
  'shell.foot': {
    en: '© 2026 BrainSAIT Ltd — BrainSAIT verification does not replace official professional licensure.',
    ar: '© 2026 BrainSAIT Ltd — التحقق في BrainSAIT لا يُغني عن الترخيص المهني الرسمي.',
  },
  'shell.command': { en: 'Command center', ar: 'مركز القيادة' },
  'shell.partner': { en: 'Partner onboarding', ar: 'انضمام الشركاء' },
  'shell.portal': { en: 'brainsait.de', ar: 'brainsait.de' },

  'nav.registry': { en: 'Registry', ar: 'السجل' },
  'nav.directory': { en: 'Directory', ar: 'الدليل' },
  'nav.fadi': { en: 'Dr. Fadi', ar: 'د. فادي' },
  'nav.farroukh': { en: 'Dr. Farroukh', ar: 'د. فاروخ' },
  'nav.orgs': { en: 'Organizations', ar: 'المؤسسات' },
  'nav.hiring': { en: 'Hiring', ar: 'التوظيف' },
  'nav.slots': { en: 'Slots', ar: 'الشواغر' },
  'nav.peers': { en: 'Peer bridge', ar: 'جسر الزمالة' },
  'nav.claim': { en: 'Claim', ar: 'المطالبة' },
  'nav.verify': { en: 'Verify', ar: 'التحقق' },
  'nav.copilot': { en: 'Copilot', ar: 'المساعد السريري' },
  'nav.desk': { en: 'Desk', ar: 'مكتب المراجعة' },

  // ---- Registry front page ---------------------------------------------
  'front.eyebrow': { en: 'Trusted provider identity infrastructure', ar: 'بنية تحتية موثوقة لهوية الممارسين' },
  'front.title': {
    en: 'Saudi healthcare identity you can verify.',
    ar: 'هوية صحية سعودية يمكنك التحقق منها.',
  },
  'front.title_span': { en: 'SPID · OID · IDN/LGR · FHIR R4.', ar: 'معرّف · OID · اسم عربي · FHIR.' },
  'front.lede': {
    en: 'Saudi Arabia’s interoperable healthcare provider identity, verification and discovery layer.',
    ar: 'طبقة هوية وتحقق واكتشاف لمقدمي الرعاية الصحية في المملكة.',
  },
  'front.lede_ar': {
    en: 'Every registered provider receives one stable SPID, one OID under the IANA BrainSAIT PEN 61026, and a claimable public BPR profile.',
    ar: 'كل مقدم مسجّل يحصل على معرّف SPID ثابت، وورقة OID تحت رقم BrainSAIT المؤسسي 61026، وملف BPR عام قابل للمطالبة.',
  },
  'front.trust_panel': { en: 'BrainSAIT trust layer', ar: 'طبقة ثقة BrainSAIT' },
  'front.claim_cta': { en: 'Claim my profile', ar: 'اطلب ملفي' },
  'front.register_cta': { en: 'Register organization', ar: 'تسجيل منشأة' },
  'front.slots_cta': { en: 'Open slot marketplace', ar: 'سوق الشواغر' },

  'front.team_title': {
    en: 'The founding neurosurgical team behind BrainSAIT',
    ar: 'فريق جراحة الأعصاب المؤسِّس لـ BrainSAIT',
  },
  'front.team_lede': {
    en: 'A three-person operating team at Aster Sanad Hospital in Riyadh, 2017–2021. Dr. Fadi Al Ghareeb led the service; Dr. Farroukh Raza was the 1st Assistant; Dr. Mohamed El Fadil was the 2nd Assistant and now the IANA RA for PEN 61026.',
    ar: 'فريق من ثلاثة جراحين في مستشفى أستر سند بالرياض (2017–2021): الدكتور فادي الغريب رئيس القسم، والدكتور فاروخ رازا المساعد الأول، والدكتور محمد الفاضل المساعد الثاني ومسجل نطاق 61026.',
  },
  'front.discovery': { en: 'Provider discovery', ar: 'اكتشاف المقدمين' },
  'front.discovery_q': {
    en: 'Search by name, specialty, SPID, Arabic IDN label or organization.',
    ar: 'ابحث بالاسم أو التخصص أو رقم مقدم الخدمة أو المنشأة.',
  },
  'front.slots_locked': { en: 'Held · delivery under review', ar: 'موقوف · التسليم قيد المراجعة' },
  'front.search_ph': {
    en: 'Search doctors, providers, specialties, SPID or organizations',
    ar: 'ابحث بالاسم أو التخصص أو رقم المقدم أو المنشأة',
  },
  'front.all': { en: 'All professions', ar: 'كل المهن' },
  'front.filters': { en: 'Filters', ar: 'تصفية' },
  'front.verified': { en: 'BrainSAIT verified', ar: 'موثّق في BrainSAIT' },
  'front.attested': { en: 'Attested', ar: 'موثّق بأقوال موثوقة' },
  'front.pending': { en: 'Verification pending', ar: 'التحقق قيد الانتظار' },
  'front.view_dossier': { en: 'View dossier', ar: 'عرض الملف' },
  'front.view_passport': { en: 'Trust passport', ar: 'جواز الثقة' },
  'front.verify_link': { en: 'Verify an SPID →', ar: 'تحقّق من معرّف SPID ←' },
  'front.ladder_title': { en: 'The six-rung registry ladder', ar: 'سلّم السجل ذو الدرجات الست' },
  'front.ladder_lede': {
    en: 'Every record’s verification state is public, directional and independently checkable.',
    ar: 'حالة التحقق لكل سجل عامة وقابلة للتحقق المستقل.',
  },
  'front.rung_here': { en: 'current', ar: 'الحالية' },
  'front.copilot': { en: 'Clinical copilot', ar: 'المساعد السريري' },
  'front.copilot_lede': {
    en: 'Evidence-aware assistance for evidence-aware clinicians. Ask a clinical, CDI, coding or NPHIES question — no patient identifiers.',
    ar: 'مساعدة سريرية واعية بالأدلة. اطرح سؤالًا سريريًا أو برمجيًا أو متعلقًا بالمطالبات — بدون بيانات المرضى.',
  },
  'front.copilot_open': { en: 'Launch copilot', ar: 'افتح المساعد السريري' },
  'front.idn_probe': { en: 'Check an Arabic IDN label', ar: 'افحص اسمًا عربيًا' },
  'front.idn_run': { en: 'Check label', ar: 'افحص' },

  // ---- Dossier ----------------------------------------------------------
  'dossier.portrait': { en: 'Portrait', ar: 'الصورة الشخصية' },
  'dossier.mrz': { en: 'Machine-readable line', ar: 'السطر الآلي للقراءة' },
  'dossier.verify': { en: 'Verify provider', ar: 'تحقّق من المقدم' },
  'dossier.passport': { en: 'Trust passport', ar: 'جواز الثقة' },
  'dossier.identifiers': { en: 'Registry identifiers', ar: 'معرّفات السجل' },
  'dossier.oid_arc': { en: 'How the OID decomposes', ar: 'تفكيك معرّف OID' },
  'dossier.arabic': { en: 'Arabic IDN / LGR', ar: 'الاسم العربي / LGR' },
  'dossier.label': { en: 'Arabic label', ar: 'الاسم العربي' },
  'dossier.lgr_table': { en: 'LGR table', ar: 'جدول LGR' },
  'dossier.reserved_host': { en: 'Reserved host', ar: 'المضيف المحجوز' },
  'dossier.appointments': { en: 'Appointments and clinical history', ar: 'المناصب والتاريخ السريري' },
  'dossier.publications': { en: 'Training and published research', ar: 'التدريب والأبحاث المنشورة' },
  'dossier.attestations': { en: 'First-hand attestations', ar: 'الشهادات المباشرة' },
  'dossier.attestation_verify': { en: 'Verify an attestation', ar: 'تحقّق من شهادة' },
  'dossier.attestation_go': { en: 'Verify signature', ar: 'تحقّق من التوقيع' },
  'dossier.attestation_ph': { en: 'ATT-000001', ar: 'ATT-000001' },
  'dossier.ledger': { en: 'Evidence ledger', ar: 'سجل الأدلة' },
  'dossier.sources': { en: 'Sources', ar: 'المصادر' },
  'dossier.fhir': { en: 'FHIR R4 export', ar: 'تصدير FHIR R4' },
  'dossier.fhir_copy': { en: 'Copy full bundle', ar: 'انسخ الحزمة' },
  'dossier.fhir_download': { en: 'Download .json', ar: 'نزّل ملف json' },
  'dossier.patient_boundary': {
    en: 'A patient-safety boundary: trust level describes registry verification, never clinical competence or outcome quality.',
    ar: 'حدّ سلامة المريض: مستوى الثقة يصف حالة التحقق في السجل، ولا يصف أبدًا الكفاءة السريرية أو جودة النتائج.',
  },
  'dossier.not_licence': {
    en: 'BrainSAIT identity verification does not replace professional licensure.',
    ar: 'التحقق من الهوية في BrainSAIT لا يُغني عن الترخيص المهني.',
  },
  'dossier.live_probes': { en: 'Live registry probes', ar: 'فحص السجل المباشر' },
  'dossier.qr': { en: 'QR-verifiable record', ar: 'سجل قابل للتحقق بالـ QR' },
  'dossier.peer_bridge': { en: 'Mutual peer trust bridge', ar: 'جسر الثقة المتبادلة' },
  'dossier.peer_open': { en: 'Open peer bridge', ar: 'افتح جسر الزمالة' },
  'dossier.slots_held': { en: 'Slots held', ar: 'الشواغر المشغولة' },
  'dossier.pending_scfhs': {
    en: 'SCFHS registration, specialty scope and expiry remain with the Saudi Commission for Health Specialties as the independent credential authority.',
    ar: 'يبقى تسجيل وتصنيف ومدة ترخيص الهيئة السعودية للتخصصات الصحية بيد الهيئة كجهة مستقلة للاعتماد.',
  },
  'dossier.idn_open': { en: 'Open IDN hub', ar: 'افتح مركز IDN' },
  'dossier.fhir_hint': {
    en: 'Practitioner · PractitionerRole · Organization · Location · Verification · Provenance.',
    ar: 'الممارس · الدور التنظيمي · المنشأة · الموقع · التحقق · المصدر.',
  },

  // ---- Passport ----------------------------------------------------------
  'passport.cta': { en: 'Verify trust chain', ar: 'تحقّق من سلسلة الثقة' },
  'passport.idn_cta': { en: 'Inspect Arabic IDN', ar: 'افحص الاسم العربي' },
  'passport.identity_chain': { en: 'Identity resolution', ar: '确定 الهوية' },
  'passport.idn_board': { en: 'Arabic IDN / LGR binding', ar: 'ربط الاسم العربي' },
  'passport.proof': { en: 'Trust proof', ar: 'إثبات الثقة' },
  'passport.receipt': { en: 'Receipt', ar: 'الإيصال' },
  'passport.route': { en: 'Verification route', ar: 'مسار التحقق' },
  'passport.timeline': { en: 'Audit timeline', ar: 'الخط الزمني' },
  'passport.peer': { en: 'Peer trust bridge', ar: 'جسر الثقة المتبادلة' },
  'passport.payload': { en: 'Public payload', ar: 'الحزمة العامة' },
  'passport.copy': { en: 'Copy payload', ar: 'انسخ الحزمة' },
  'passport.iddn_eligible': { en: ' eligible · LGR pass', ar: 'مطابق · يجتاز LGR' },
  'passport.acceptance': {
    en: 'I accept a public metadata peer connection with no PHI, no patient-specific advice, and counterparty acceptance required.',
    ar: 'أوافق على اتصال زمالة ببيانات عامة دون بيانات صحية ودون نصائح خاصة بمريض، مع اشتراط قبول الطرف الآخر.',
  },
  'passport.peer_dim': { en: 'Review dimension', ar: 'بُعد المراجعة' },
  'passport.peer_note': { en: 'Recommendation / consult note', ar: 'التوصية / ملاحظة الاستشارة' },
  'passport.peer_copy': { en: 'Copy peer receipt', ar: 'انسخ الإيصال' },
  'passport.peer_download': { en: 'Download JSON', ar: 'نزّل JSON' },
  'passport.peer_save': { en: 'Save in registry', ar: 'احفظ في السجل' },
  // ---- Bilingual table + desk labels --------------------------------------
  'dossier.col.institution': { en: 'Institution', ar: 'المؤسسة' },
  'dossier.col.role': { en: 'Role', ar: 'الدور' },
  'dossier.col.period': { en: 'Period', ar: 'الفترة' },
  'dossier.col.evidence': { en: 'Evidence', ar: 'الدليل' },
  'dossier.col.claim': { en: 'Claim', ar: 'الادعاء' },
  'dossier.col.source': { en: 'Source', ar: 'المصدر' },
  'dossier.col.confidence': { en: 'Confidence', ar: 'درجة الثقة' },
  'desk.task': { en: 'Review task', ar: 'مهمة المراجعة' },
  'desk.risk': { en: 'Risk', ar: 'الخطورة' },
});


registerTranslator(t);

export default t;

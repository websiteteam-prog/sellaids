<?php
/* Build a .pptx from a recce, using PhpPresentation. Saves to $outPath. */
require_once __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\IOFactory;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Slide\Background\Color as BgColor;

function oams_dataurl_to_tmp($dataUrl) {
    if (!is_string($dataUrl) || strpos($dataUrl, 'data:image') !== 0) return null;
    $c = strpos($dataUrl, ',');
    if ($c === false) return null;
    $bin = base64_decode(substr($dataUrl, $c + 1));
    if ($bin === false) return null;
    $ext = (strpos($dataUrl, 'image/png') !== false) ? 'png' : 'jpg';
    $f = tempnam(sys_get_temp_dir(), 'oams') . '.' . $ext;
    file_put_contents($f, $bin);
    return $f;
}

function oams_text($slide, $txt, $x, $y, $w, $h, $size, $bold, $argb) {
    $s = $slide->createRichTextShape();
    $s->setOffsetX($x)->setOffsetY($y)->setWidth($w)->setHeight($h);
    $s->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    foreach (explode("\n", $txt) as $i => $line) {
        if ($i > 0) $s->createParagraph();
        $run = $s->createTextRun($line);
        $run->getFont()->setSize($size)->setBold($bold)->setColor(new Color($argb));
    }
    return $s;
}

function oams_img($slide, $path, $x, $y, $w, $h) {
    if (!$path || !file_exists($path)) return;
    $d = $slide->createDrawingShape();
    $d->setPath($path)->setOffsetX($x)->setOffsetY($y)->setWidth($w)->setHeight($h);
}

/**
 * @return array list of temp files to clean up after saving
 */
function oams_build_pptx($store, $work, $meta, $outPath) {
    $tmps = [];
    $ppt = new PhpPresentation();
    $navy = 'FF1F3864';
    $white = 'FFFFFFFF';
    $grey = 'FF555555';

    // ---- cover (reuse first slide) ----
    $cover = $ppt->getActiveSlide();
    $cover->setBackground((new BgColor())->setColor(new Color($navy)));
    oams_text($cover, 'OAMS Store Recce Report', 40, 200, 880, 60, 34, true, $white);
    oams_text($cover, isset($store['storeName']) ? $store['storeName'] : 'Store', 40, 290, 880, 50, 24, false, 'FFAEC1E8');
    $sub = trim(implode('  -  ', array_filter([@$store['storeCode'], @$store['category'], @$store['city']])));
    oams_text($cover, $sub, 40, 350, 880, 40, 14, false, 'FFCBD6EE');
    oams_text($cover, 'Recce by: ' . (@$meta['userName'] ?: '-') . ' (' . (@$meta['userEmpCode'] ?: '-') . ')', 40, 400, 880, 40, 14, false, 'FFCBD6EE');
    oams_text($cover, @$meta['submittedAt'] ?: date('Y-m-d H:i'), 40, 440, 880, 40, 12, false, 'FF8FA6D6');

    // ---- details ----
    $d = $ppt->createSlide();
    oams_text($d, 'Store Details', 30, 24, 700, 40, 22, true, $navy);
    $lines = [];
    foreach ([['Store Name', @$store['storeName']], ['Store Code', @$store['storeCode']], ['Category', @$store['category']],
              ['City', @$store['city']], ['Coordinator', @$store['coordinatorName']], ['Contact', @$store['coordinatorNumber']],
              ['Recce by', (@$meta['userName'] ?: '') . ' (' . (@$meta['userEmpCode'] ?: '') . ')']] as $r) {
        if ($r[1]) $lines[] = $r[0] . ':  ' . $r[1];
    }
    oams_text($d, implode("\n", $lines), 30, 90, 520, 300, 14, false, 'FF333333');
    if (!empty($work['storeRemark'])) {
        oams_text($d, 'Store remark:', 580, 90, 350, 30, 13, true, $navy);
        oams_text($d, $work['storeRemark'], 580, 120, 350, 200, 12, false, $grey);
    }
    if (!empty($work['finalRemark'])) {
        oams_text($d, 'Final remark:', 580, 340, 350, 30, 13, true, $navy);
        oams_text($d, $work['finalRemark'], 580, 370, 350, 200, 12, false, $grey);
    }

    // ---- store photos (3x2 grid) ----
    $photos = array_values(array_filter(isset($work['storeImages']) ? $work['storeImages'] : [], 'is_string'));
    oams_photo_slides($ppt, $photos, 'Store Photos', $tmps);

    // ---- one slide per element ----
    $els = isset($work['elements']) ? $work['elements'] : [];
    foreach ($els as $idx => $el) {
        $s = $ppt->createSlide();
        oams_text($s, 'Element ' . ($idx + 1) . ': ' . (@$el['type'] ?: ''), 30, 24, 900, 40, 20, true, $navy);
        $det = "Type:  " . (@$el['type'] ?: '') . "\nWidth:  " . (@$el['width']) . "\"\nHeight:  " . (@$el['height']) . "\"\nTotal:  " . (@$el['total']) . "\"";
        oams_text($s, $det, 30, 100, 320, 200, 14, false, 'FF333333');
        if (!empty($el['remark'])) {
            oams_text($s, 'Remark:', 30, 320, 320, 30, 13, true, $navy);
            oams_text($s, $el['remark'], 30, 350, 320, 220, 12, false, $grey);
        }
        $eph = array_values(array_filter(isset($el['photos']) ? $el['photos'] : [], 'is_string'));
        // up to 4 photos on the right (2x2)
        $pos = [[380, 100], [660, 100], [380, 300], [660, 300]];
        for ($i = 0; $i < min(4, count($eph)); $i++) {
            $t = oams_dataurl_to_tmp($eph[$i]);
            if ($t) { $tmps[] = $t; oams_img($s, $t, $pos[$i][0], $pos[$i][1], 260, 175); }
        }
        // extra element photos -> more slides
        if (count($eph) > 4) oams_photo_slides($ppt, array_slice($eph, 4), 'Element ' . ($idx + 1) . ' — more photos', $tmps);
    }

    $writer = IOFactory::createWriter($ppt, 'PowerPoint2007');
    $writer->save($outPath);
    foreach ($tmps as $t) @unlink($t);
    return true;
}

function oams_photo_slides($ppt, $photos, $title, &$tmps) {
    $per = 6; $cols = 3; $cw = 290; $ch = 200; $gx = 15; $gy = 15; $x0 = 30; $y0 = 110;
    for ($s = 0; $s < count($photos); $s += $per) {
        $slide = $ppt->createSlide();
        oams_text($slide, $title, 30, 24, 900, 40, 20, true, 'FF1F3864');
        $chunk = array_slice($photos, $s, $per);
        foreach ($chunk as $i => $data) {
            $t = oams_dataurl_to_tmp($data);
            if (!$t) continue;
            $tmps[] = $t;
            $r = intdiv($i, $cols); $c = $i % $cols;
            oams_img($slide, $t, $x0 + $c * ($cw + $gx), $y0 + $r * ($ch + $gy), $cw, $ch);
        }
    }
}
